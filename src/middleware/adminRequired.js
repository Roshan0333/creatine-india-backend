import jwt from "jsonwebtoken";

const jwtKey = process.env.JWT_Key

export const verifyToken = async (req, res, next) => {
    try{
        const authHeaders = await req.headers.authorization;

        if(!authHeaders || !authHeaders.startsWith("Bearer ")){
            return res.status(401).json({success:false, message: "Please login"});
        }

        const token = authHeaders.split(" ")[1];

        const tokenVerify = await jwt.verify(token, jwtKey);

        if(tokenVerify.user.role !== "admin"){
            return res.status(401).json({success:false, message:"Access denied"});
        }

        req.user = tokenVerify.user;

        next();
    }
    catch(err){
        return res.status(500).json({success: false, message: "Something went wrong."})
    }
}