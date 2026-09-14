import { Schema, model } from "mongoose";

const nutritionSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    value:{
        type: String,
        required: true
    },
    unit:{
        type: String,
        required: true
    },
    displayOrder:{
        type: Number
    },
    status:{
        type: Boolean,
        default: true,
        enum:[false, true],
    }
}, {timestamps: true});

const nutritionModel = model("Nutrition", nutritionSchema);

export default nutritionModel;