import admin from "../model/admin.model.js";
import {admin_Jwt_Token} from "../utils/jwt.js";
import {encryptPassword, decryptPassword} from "../utils/bcrypt.js";

export const register  = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({success: false, message:"All field is required"});
        }

        const encrypt = await encryptPassword(password);

        const adminDetail = await admin.create({
            email:email,
            password: encrypt.password
        });

        const tokenPayload = {
            _id: adminDetail._id,
            name: adminDetail.name,
            email: adminDetail.email,
            role: "admin"
        };

        const token = await admin_Jwt_Token(tokenPayload);

        return res.status(200).json({success: true, message: "Signup Successfully", token: token.token})

    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const userData = req.user;

        if(!email || !password){
            return res.status(400).json({success: false, message:"All field is required"});
        }

        const decrypt = await decryptPassword(password, userData.password);

        if(!decrypt.result){
            return res.status(401).json({success:false, message: "Incorrect password."})
        }

        const tokenPayload = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            role: "admin"
        };

        const token = await admin_Jwt_Token(tokenPayload);

        return res.status(200).json({success: true, message:"Login Successfully", token: token.token});
    }
    catch(err){
        return res.status(500).json({success: false, message: err.message})
    }
}