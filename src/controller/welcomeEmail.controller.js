import welcomeModel from "../model/welcomeEmail.model.js";

export const welcome = async (req, res) =>{
    try{
        const {email, status} = req.body;

        if(!email){
            return res.status(400).json({success:false, message:"Email is required"});
        }

        welcomeModel.create({
            email: email,
            status
        });

        return res.status(200).json({success:true, message: "Request Send Successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: "Failed to send request", error: err.message});
    }
}

export const getWelcomeContact = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query;

        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

        const skip = (page - 1) * limit;

        const [welcomeContacts, totalWelcomeContact] = await Promise.all([
            welcomeModel
            .find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean(),

            welcomeModel.countDocuments({})
        ]);

        if(welcomeContacts.length === 0){
            return res.status(404).json({success:false, message: "No contact request found."});
        }

        return res.status(200).json({
            success: true,
            message :"Welcome Contact fetched Successfully",
            welcomeContactList: welcomeContacts,
            pagination:{
                currentPage: page,
                totalPages: Math.ceil(totalWelcomeContact/limit),
                totalWelcomeContact,
                limit,
                hasNextPage:
                    page < Math.ceil(totalWelcomeContact / limit),
                hasPreviousPage: page > 1,
            }
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to Response Request", message: err.message });
    }
}

export const updateWelcomeContact = async (req, res) => {
    try{
        const {id} = req.params;
        const {status} = req.body;

        if(!id){
            return res.status(400).json({success:false, message: "Id is required"});
        }

        const welcomeDetail = await welcomeModel.findById(id);

        if(!welcomeDetail){
            return res.status(404).json({success:false, message:"Email detail are not found."});
        }

        welcomeDetail.status = status;

        return res.status(200).json({success:true, message:"Email status update successfully"});
    }
    catch(err){
        return res.status(500).json({success: false, message: err.message})
    }
}

export const deleteWelcomeContact = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:false, message: "Id is required"});
        }

        const emailDetails = await welcomeModel.findByIdAndDelete(id);

          if (!emailDetails) {
            return res.status(404).json({
                success: false,
                message: "Welcome contact not found",
            });
        }

        return res.status(200).json({success:true, message: "Email delete successfully"})
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
}