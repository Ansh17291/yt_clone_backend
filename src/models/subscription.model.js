import mongoose from "mongoose";
import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
    subscriber :{
        type: Schema.Types.ObjectId, // the one who is subscribing
        ref : "User",
    },
    channel :{
        type : Schema.Types.ObjectId, 
        ref : "User", // the one who is being subscribed to
    }
}, {timestamps : true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);