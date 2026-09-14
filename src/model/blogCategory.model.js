import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    category: [{
        english: {
            type: String,
            required: true
        },
        arabic: {
            type: String,
            required: true
        },
        farsi: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true,
  });

const categoryModel = model("Category", categorySchema);

export default categoryModel