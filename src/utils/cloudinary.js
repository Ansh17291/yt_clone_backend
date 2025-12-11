import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// read from docs these are the env variables to be set
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null 

        // upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        // file has been uploaded successfully !
        console.log("File has been uploaded successfully ! on cloudinary", response.url, response);
        fs.unlinkSync(localFilePath); // remove the locally saved file after upload is done
        console.log("file removed successfully !");
        return response;
        
    }catch(err) {
        fs.unlinkSync(localFilePath) // remove the locally saved file ,as upload operation failed !
        // unlinkSync .. remove this and then only move ahead !
        return null
        
    }
}

export {uploadOnCloudinary}