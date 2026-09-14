import NutritionModel from "../model/Nutrition Facts.model.js";

export const addNutrition = async (req, res) => {
    try {
        const { name, value, unit, displayorder, status } = req.body;

        if (!name || !value || !unit) {
            return res.status(400).json({ success: false, message: "Name, value and unit is required" });
        }

        const nutritionDetails = await NutritionModel.create({
            name,
            value,
            unit,
            displayOrder: displayorder,
            status
        });

        if (!nutritionDetails) {
            return res.status(500).json({ success: false, message: "Failed to add nutrition" });
        }

        return res.status(200).json({ success: true, message: "Nutrition add successfully" });

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const updateNutrition = async (req, res) => {
    try {
        const { name, value, unit, displayorder, status } = req.body;

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Nutrition id is required" });
        }

        const nutritionDetails = await NutritionModel.findById(id);

        if (!nutritionDetails) {
            return res.status(404).json({ success: false, message: "Nutrition are not found" });
        }

        if (name !== undefined) {
            nutritionDetails.name = name
        }

        if (value !== undefined) {
            nutritionDetails.value = value
        }

        if (displayorder !== undefined) {
            nutritionDetails.displayOrder = displayorder
        }

        if (status !== undefined) {
            nutritionDetails.status = status
        }


        await nutritionDetails.save();

        return res.status(200).json({ success: true, message: "Nutrition update successfully" });

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const deleteNutrition = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Nutrition id is required" });
        }

        const deleteNutrition = await NutritionModel.findByIdAndDelete(id)
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const getNutritionByAdmin = async (req, res) => {
    try {
        const nutrition = await NutritionModel.find();

        return res.status(200).json({ success: true, nutrition: nutrition })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const getNutrition = async (req, res) => {
    try {
        const nutrition = await NutritionModel.find({ status: true });

        return res.status(200).json({ success: true, nutrition: nutrition });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}