import mongoose, {Schema} from "mongoose";

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
},{timestamps: true});

const adminModel = new mongoose.model("Admin", adminSchema);

export default adminModel