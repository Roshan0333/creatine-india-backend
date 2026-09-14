import ReviewModel from "../model/review.model.js";

export const addReview = async (req, res) => {
    try{
        const {name, date, rating, content} = req.body;

        if(!name || !rating || !content) {
            return res.status(400).json({success:false, message: "Name, rating and content is required"});
        }

        let todayDate;

        if(!date){
            todayDate = new Date().getDate()
        };

        const review = await ReviewModel.create({
            name,
            rating,
            content,
            date: (!date)?todayDate:date
        });


        return res.status(200).json({success:true, message: "Review add successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export  const updateReview = async (req, res) => {
    try{
        const {name, date, rating, content} = req.body;
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:false, message: "Review id is required"});
        }

        const reviewDetails = await ReviewModel.findById(id);

        if(!reviewDetails){
            return res.status(404).json({success:false, message: "Review are not found"})
        };

        if(date !== undefined){
            reviewDetails.date = date
        }

        reviewDetails.name = name;
        reviewDetails.rating = rating;
        reviewDetails.content = content;

        await reviewDetails.save();

        return res.status(200).json({success:true, message: "Review add successfully"});
        }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}

export const deleteReview = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:false, message:"Review id is required"});
        }

        const reviewDetails = await ReviewModel.findById(id);

        if(!reviewDetails){
            return res.status(404).json({success:false, message:"Review are found"});
        }

        return res.status(200).json({success: true, message:"Review delete successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}

export const getReview = async (req, res) => {
    try{
        const reviews = await ReviewModel.find();

        return res.status(200).json({success: true, reviews: reviews})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}