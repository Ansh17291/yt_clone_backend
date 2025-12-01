import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/User.js";
import uploadOnCloudinary from "../utils/uploadOnCloudinary.js";


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
    
    const {fullName, username, email, password} = req.body;
    if ([fullName, username, email, password].some(field => field.trim() === '')) {
        throw new ApiError(400, "all fields are required");
    }

    const exsistingUser = User.findOne({
        $or:[
            {email}, 
            {username}
        ]
    })

    if(exsistingUser){
        throw new ApiError(409, "User already exists with this email or username");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImagesLocalPaths = req.files?.coverImage?.map(file => file.path);    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrls = [];

    if(coverImagesLocalPaths && coverImagesLocalPaths.length > 0){
        for(const localPath of coverImagesLocalPaths){
            const url = await uploadOnCloudinary(localPath);
            if(url) coverImageUrls.push(url);
        }
    }

    if(!avatarUrl){
        throw new ApiError(500, "Error in uploading avatar image , please try again !");
    }

    const user = await User.create({
        fullName,
        username : username.toLowerCase(),
        email,
        avatar: avatarUrl.url,
        coverImages: coverImageUrls?.map(obj => obj.url) || "",
        password
    })

    const createdUser = User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "User registration failed, please try again !");
    }

    res.status(201).json(
        new ApiResponse(
        201,
        "User registered successfully",
        createdUser
    ));




})

export {registerUser};
