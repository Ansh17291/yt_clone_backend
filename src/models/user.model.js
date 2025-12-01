import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// we can also destructure Schema from mongoose and then use it like :
// const userSchema = new Schema({})
const userSchema = new mongoose.Schema({
    userName :{
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
    fullName :{
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

userSchema.pre("save", async function (next) {
    // the below if condition is written so that only when password is changed then only bcrypt is used otherwise while saving anything in  user.model would make password hash again and again, there hash if only when password is modified !
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        next(); // next ?? yeah yeah next beczz this is a middleware of mongoose 
    }
})

userSchema.methods.isPasswordCorrect = async function (password){
   return await  bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
        _id : this._id, 
        userName : this.userName,
        email: this.email, 
        password : this.password
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id : this._id, 
        userName: this.userName,
        email: this.email,
        password: this.password
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model("User", userSchema);
export default userSchema;