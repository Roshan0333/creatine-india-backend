import InstaPostModel from "../model/instaPost.model.js";
import {uploadToCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"

export const addInstaPost = async (req, res) => {
    try{
        const {url, displayorder, status} = req.body;

        const postImage = req.file;

        if(!url || !postImage){
            return res.status(400).json({success:false, message: "Instagram url and post image are required."});
        };

        const postLink = await uploadToCloudinary(
            postImage.buffer,
            "instapost"
        );

        const postDetails  = await InstaPostModel.create({
            url,
            displayOrder: displayorder,
            postImage: postLink.secure_url,
            status
        });


        return res.status(200).json({success:true, message:"Instagram post add successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}

export const updateInstaPost = async (req, res) => {
    try{
        const {id} = req.params;

        const {url, displayorder, status} = req.body;

        const postImage = req.file;

        if(!id){
            return res.status(400).json({success:false, message: "InstapostId is required"});
        };

        const instaDetails = await InstaPostModel.findById(id);

        if(!instaDetails){
            return res.status(404).json({success:false, message: "Instapost are not found"});
        };

        if(!url && url !== undefined){
            instaDetails.url = url
        }
         
        if(!displayorder && displayorder !== undefined){
            instaDetails.displayOrder = displayorder
        }

        if(!status && status !== undefined){
            instaDetails.status = status
        }

        if(!postImage && postImage !== undefined){
            const postLink = await uploadToCloudinary(
                postImage.buffer,
                "instapost"
            );

            if(!instaDetails.postImage){
                await deleteFromCloudinary(instaDetails.postImage)
            };

            instaDetails.postImage = postLink.secure_url
        }

        await instaDetails.save();

        return res.status(200).json({success:true, message:"Instagram post update instagram."})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export const deleteInstaPost = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success: false, message:"InstaPostId is required"});
        }

        const instapostDetails = await InstaPostModel.findByIdAndDelete(id);

        if(!instapostDetails){
            return res.status(404).json({success:false, message: "Instapost not found."});
        }

        return rer.status(200).json({success:true, message: "Instapost delete successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export const getInstaPostByAdmin = async (req, res) => {
    try{
        const instapost = await InstaPostModel.find();

        return res.status(200).json({success:true, instapost})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export const getInstaPost = async (req, res) => {
    try{
        const instaPost = await InstaPostModel.find({success:true});

        return res.status(200).json({success:true, instaPost});
    }catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}
