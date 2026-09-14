import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date:{
        type: String
    },
    rating:{
        type: Number,
        required: true
    },
    content:{
        type: String,
        required: true
    }
}, {timestamps: true});

const reviewModel = model("review", reviewSchema);

export default reviewModel;