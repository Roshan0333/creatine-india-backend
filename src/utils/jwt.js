
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const jwtKey = process.env.JWT_Key;

export const admin_Jwt_Token = async (user) => {
    try{
        const token = await jwt.sign({user}, jwtKey, {expiresIn:"24h"});

        return {
            status: true,
            token: token
        }
    }
    catch(err){
        return {
            status: false,
            error: err.message
        }
    }
}