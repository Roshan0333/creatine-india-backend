import {Schema, model} from "mongoose";

const contactSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    orderNumber:{
        type: String,
        default: null
    },
    message:{
        type: String,
        required: true
    },
    contactStatus:{
        type: Boolean,
        default: false,
        enum:[true, false],
    }
}, {timestamps: true});

const contactModel = new model("Contact", contactSchema);

export default contactModel;