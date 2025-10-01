import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // hit and try where to use constants or constants.js 

const connectDB = async() =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`Connected to the database successfully DB HOST : ${connectionInstance.connection.host}`);

        // console.log(connectionInstance); just explore what all things are there!


    }catch(error) {
        console.error("Error connecting to the database", error);
        // is there is an error, exit the process with failure
        process.exit(1);
    }
}


export default connectDB;