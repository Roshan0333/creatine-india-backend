import {Schema, model} from "mongoose";

const faqSchema = new Schema({
    question:{
        type: String,
        required: true
    },
    answer:{
        type: String,
        required: true
    },
    displayOrder:{
        type: Number
    },
    status:{
        type: Boolean,
        default: true,
        enum:[false, true]
    }
}, {timestamps: true});

const faqModel = model("faq", faqSchema);

export default faqModel;