import {Schema, model} from "mongoose";

const instaPostSchema = new Schema({
    url:{
        type: String,
        required: true,
        unique: true
    },
    postImage:{
        type:String,
        required: true
    },
    displayOrder:{
        type:Number
    },
    status:{
        type: Boolean,
        default: true,
        enum: [false, true]
    }
}, {timestamps: true});

const instaPostModel = model("InstaPost", instaPostSchema);

export default instaPostModel;