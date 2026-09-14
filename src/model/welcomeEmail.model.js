import {Schema, model} from "mongoose";

const welcomeSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true,
        enum:[false, true]
    }
}, {timestamps: true})

const welcomeModel = new model("Welcome Email", welcomeSchema);

export default welcomeModel;