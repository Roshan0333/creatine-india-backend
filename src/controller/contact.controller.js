import contactModel from "../model/contact.model.js";

export const contact = async (req, res) => {
    try {
        const { fullName, email, subject, orderNumber, message } = req.body;
        

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "Send Required Field Value" });
        }

        await contactModel.create({
            name: fullName,
            email: email,
            subject: subject,
            orderNumber: orderNumber,
            message: message
        });

        return res.status(200).json({ success: true, message: "Request Send Successfully" });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed Send Request", error: err.message });
    }
}

export const getContact = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.query;

        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

        const skip = (page - 1) * limit;

        const [contacts, totalContact] = await Promise.all([
            contactModel
            .find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .lean(),


            contactModel.countDocuments({})
        ]);

        if(contacts.length === 0){
            return res.status(404).json({success:false, message: "No contact request found."});
        }

        return res.status(200).json({
            success: true,
            message :"Contact fetched Successfully",
            contactList: contacts,
            pagination:{
                currentPage: page,
                totalPages: Math.ceil(totalContact/limit),
                totalContact,
                limit,
                hasNextPage:
                    page < Math.ceil(totalContact / limit),
                hasPreviousPage: page > 1,
            }
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Failed to Response Request", message: err.message });
    }
}

export const updateStatus = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:false, message:"Contact Id is required."});
        }

        const contactDetail = await contactModel.findById(id);

        if(!contactDetail){
            return res.status(404).json({success:false, message: "Contact is not found."});
        }

        contactDetail.contactStatus = !contactDetail.contactStatus;

        await contactDetail.save();

        return res.status(200).json({success:true, message:"Contact Status Update Successfully"});

    }
    catch(err){
        return res.status(500).json({success:false, message:"Failed to update", error: err.message});
    }
}