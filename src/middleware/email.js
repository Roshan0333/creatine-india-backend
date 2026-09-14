import admin from "../model/admin.model.js";

export const isDuplicateEmail = async (req, res, next) => {
    try {

        const { email, phone } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const isAdminPresent = await admin.findOne({ email: email });

        if (isAdminPresent) {
            return res.status(401).json({ success: false, message: "Email already present" });
        }

        next();
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const isAdminEmailPresent = async (req, res, next) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const isEmail = await admin.findOne({ email: email });

        if (!isEmail) {
            return res.status(404).json({ success: false, message: "Email not found" });
        }

        req.user = isEmail

        next();

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

