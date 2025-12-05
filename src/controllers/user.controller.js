import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";


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

export {registerUser};
