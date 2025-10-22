import mongoose, { Schema } from "mongoose";

// we can also destructure Schema from mongoose and then use it like :
// const userSchema = new Schema({})
const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim : true,
        index: true,
    }, 
    email: {
        type : String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname :{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar:{
        type: String, // cloudinary url
        required: true,
    },
    coverImage:{
        type : String,
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type: String,
        required : [true, 'Password is required']
    }, 
    refreshToken:{
        type: String,
    }


}, {timestamps: true})

export const User = mongoose.model("User", userSchema);
export default userSchema;