import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import  jwt, { decode } from 'jsonwebtoken';


const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;

        // after changing the field we also need to save this in the mongodb , but as soon as we do user.save() mongodb starts to cry saying i need username , password, etc like only thing we gave during signup , but here we are only adding refresh token so do we need to send all those things again ? ofc NO , hence we use "validateBeforeSave : false " , saying that don't cry mongodb ik what i am doing. 
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken};

    }catch(error) {
        throw new ApiError(500, "Something went wrong while generating access or refresh token ")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    // get user from frontend
    // validation - not null 
    // check if user already exists : username or email
    // check for image , check for avatar 
    // upload them on cloudinary , avatar
    // create usr object - create entry in db 
    // remove password and refresh token from response
    // check for  user creation success
    // return res
    
    const {fullName, userName, email, password} = req.body;
    if ([fullName, userName, email, password].some(field => field.trim() === '')) {
        throw new ApiError(400, "all fields are required");
    }

    const exsistingUser = await User.findOne({
        $or:[
            {email}, 
            {userName}
        ]
    })

    if(exsistingUser){
        throw new ApiError(409, "User already exists with this email or username");
    }
    console.log(req);
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // support either `coverImages` (plural) or `coverImage` (singular) from frontend
    const coverFiles = req.files?.coverImages || req.files?.coverImage || [];
    const coverImagesLocalPaths = Array.isArray(coverFiles) ? coverFiles.map(f => f.path) : [];

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    const coverImageUrls = [];
    if(coverImagesLocalPaths.length > 0){
        for(const localPath of coverImagesLocalPaths){
            const url = await uploadOnCloudinary(localPath);
            if(url) coverImageUrls.push(url.url);
        }
    }

    if(!avatarUrl){
        throw new ApiError(500, "Error in uploading avatar image , please try again !");
    }

    const user = await User.create({
        fullName,
        userName : userName.toLowerCase(),
        email,
        avatar: avatarUrl.url,
        coverImages: coverImageUrls,
        password
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "User registration failed, please try again !");
    }
    console.log("User uploaded successfully !");

    return res.status(201).json(
        new ApiResponse(
        201,
        "User registered successfully",
        createdUser.toObject()
    ));

})


const loginUser = asyncHandler(async(req, res) =>{
    // req body -> data
    // username or email
    // find the user
    // password check 
    // access and refresh token give user 
    // send cookies (as secure cookies)
    console.log(req.body)
    const {email,  userName, password} = req.body;

    if(!userName && !email){
        throw new ApiError(400, "Username or email is required to login");
    }

    const user = await User.findOne({
        $or:[
            {email},
            {userName: userName?.toLowerCase()}
        ]
    })

    if(!user){
        throw new ApiError(404, "User not found with this email or username");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password, please try again !");
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    // now if we see in this function we have refference of the user which doesn't have access or refresh token so what we can do is update the user or query the database once again to get the user with refresh token

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true, 
        secure : true, // only send the cookie on https connection
        sameSite : "none", // cross site cookie 
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            "User logged in successfully",
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            }
        )
    )
})


const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.body._id, 
        {
            $set :{
                refreshToken : undefined
            }
        },
        {
            // new : true returns the updated values and not the old one , basically first uodates the db then sends the values , but we are not storing it so doesn't matter but just for knowledge
            new : true
        }        
    )

    const options = {
        httpOnly: true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully !",{}))
})

const refreshAcessToken = asyncHandler(async (req, res) =>{
    try {
        const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken;  
        if(!incomingRefreshToken){
            throw new ApiError(400, "Unauthorized Request");
        }
    
        // here we decode the refresh token becz we sent user the encrypted token!
        const decodedToken = jwt.verify(
            incomingRefreshToken, 
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decode?._id);
        if(!user){
            throw new ApiError(401, "Invalid Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken ){
            throw new ApiError(401, "Refrseh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200, "Access Token refreshed Successfully" , {accessToken,refreshToken}
    
        ))
    } catch (error) {
        throw new ApiError(400, error.message || "invalid refresh token");
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken
};
