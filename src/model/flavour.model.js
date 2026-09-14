import { Schema, model } from "mongoose";

const flavourSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    weight:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    displayOrder:{
        type: Number,
    },
    featuredImage:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true,
        enum:[false, true]
    }
}, {timestamps: true});

const flavourModel = model("Flavour", flavourSchema);

export default flavourModel;