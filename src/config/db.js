import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connect Successfully");
        return db;
    }
    catch(err){
        console.error("Database Connection Failed:", err.message);
    }
}

export default databaseConnection;