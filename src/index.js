// require("dotenv").config({path: "./env"}); this works perfectly fine but this is not a esmodule syntax therefore just to maintain the consistency we can use esmodule ssyntax as well let's see how
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})



connectDB();

// Rest of the server code goes here ...









// This is one to connect to db ... connecting in the index.js file is not a good practice
// So, commenting it out for now
/*
import express from "express";

const app = express();
(async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error)=>{
            console.error("Error connecting to the database", error);
            throw new Error("Error connecting to the database");
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    }catch(error) {
        console.error("Error connecting to the database", error);
        throw error;
    }
})()


*/