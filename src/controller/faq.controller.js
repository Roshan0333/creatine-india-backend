import faqModel from "../model/Faq.model.js";


export const getAllFaq = async (req, res) => {
    try {
        const faq = await faqModel.find({ status: true });

        if (faq.length === 0) {
            return res.status(404).json({ success: false, message: "No faq found" });
        }

        return res.status(200).json({ success: true, faq: faq });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}


export const faqAdd = async (req, res) => {
    try {
        const { question, answer, displayorder, status } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ success: false, message: "Question and Answer are required." });
        }

        const faqDetails = await faqModel.create({
            question,
            answer,
            displayOrder: displayorder,
            status
        });

        return res.status(200).json({ success: true, message: "Faq add successfully" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const getAllFaqByAdmin = async (req, res) => {
    try {
        const faq = await faqModel.find();

        if (faq.length === 0) {
            return res.status(404).json({ success: false, message: "No faq found" });
        }

        return res.status(200).json({ success: true, faq: faq });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
};

export const updateFaq = async (req, res) => {
    try{
        const {id} = req.params;
        const {question, answer, displayorder, status} = req.body;

        if(!id){
            return res.status(400).json({success:false, message: "Faq Id is required"});
        }

        const faq = await faqModel.findByIdAndUpdate(
            id,
            {
                question,
                answer,
                displayOrder: displayorder,
                status
            }
        );

        if(!faq){
            return res.status(404).json({success:false, message: "Faq is not found"});
        }

        return res.status(200).json({success: true, message: "Faq update successfully"})

    }catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}

export const deleteFaq = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:false, message: "Faq Id is required"});
        };

        const faq = await faqModel.findByIdAndDelete(id);

        if(!faq){
            return res.status(404).json({success:false, message: "Faq is not found"});
        }

        return res.status(200).json({success:true, message: "Faq delete successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message});
    }
}
