import flavourModel from "../model/flavour.model.js";
import {uploadToCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"

export const addFlavour = async (req, res) => {
    try {
        const { name, weight, price, displayorder, status } = req.body;


        const featuredImage = req.files?.featuredImage?.[0];
        const image = req.files?.image?.[0];

        if (!name || !weight || !price) {
            return res.status(400).json({ success: false, message: "Name, weight and price is required" });
        }

        if (!featuredImage || !image) {
            return res.status(400).json({ success: false, message: "FeatureImage and bottle image is required" });
        }

        const featuredImageResult = await uploadToCloudinary(
            featuredImage.buffer,
            "flavour"
        );

        const imageResult = await uploadToCloudinary(
            image.buffer,
            "flavour"
        );

        const flavourDetails = await flavourModel.create({
            name,
            weight,
            price,
            displayOrder: displayorder,
            featuredImage: featuredImageResult.secure_url,
            image: imageResult.secure_url,
            status
        });

        return res.status(200).json({ success: true, message: "Flavour add successfully" });

    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const updateFlavour = async (req, res) => {
    try {
        const {name,weight,price,displayorder,status} = req.body;

        const { id } = req.params;

        const featuredImage = req.files?.featuredImage?.[0];
        const image = req.files?.image?.[0];

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Flavour Id is required",
            });
        }

        const flavourDetails = await flavourModel.findById(id);

        if (!flavourDetails) {
            return res.status(404).json({
                success: false,
                message: "Flavour not found",
            });
        }

        if (name !== undefined) {
            flavourDetails.name = name;
        }

        if (weight !== undefined) {
            flavourDetails.weight = weight;
        }

        if (price !== undefined) {
            flavourDetails.price = price;
        }

        if (displayorder !== undefined) {
            flavourDetails.displayorder = displayorder;
        }

        if (status !== undefined) {
            flavourDetails.status = status;
        }

        if (featuredImage) {
            const uploadedFeaturedImage = await uploadToCloudinary(
                featuredImage.buffer,
                "flavour"
            );

            if (uploadedFeaturedImage?.secure_url) {
                if (flavourDetails.featuredImage) {
                    await deleteFromCloudinary(flavourDetails.featuredImage);
                }

                flavourDetails.featuredImage = uploadedFeaturedImage.secure_url;
            }
        }

        if (image) {
            const uploadedImage = await uploadToCloudinary(
                image.buffer,
                "flavour"
            );

            if (uploadedImage?.secure_url) {
                if (flavourDetails.image) {
                    await deleteFromCloudinary(flavourDetails.image);
                }

                flavourDetails.image = uploadedImage.secure_url;
            }
        }

        await flavourDetails.save();

        return res.status(200).json({
            success: true,
            message: "Flavour updated successfully",
            data: flavourDetails,
        });
    } catch (err) {
        console.error("Update Flavour Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const deleteFlavour = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({success:true, message: "Flavour id is required"});
        };

        const flavourDetails = await flavourModel.findByIdAndDelete(id);

        if(!flavourDetails){
            return res.status(404).json({success:false, message: "Flavour are not found"});
        }

        return res.status(200).json({success:true, message:"Flavour delete successfully"});
    }
    catch(err){
        return res.status(500).json({success:false, message: err.message})
    }
};

export const getAllFlavourByAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const [flavours, total] = await Promise.all([
            flavourModel
                .find()
                .sort({ displayorder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            flavourModel.countDocuments(),
        ]);

        const totalPages = Math.ceil(total / limitNumber);

        return res.status(200).json({
            success: true,
            flavours,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}; 

export const getAllFlavour = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
        } = req.query;

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const filter = {
            status: true,
        };

        const [flavours, total] = await Promise.all([
            flavourModel
                .find(filter)
                .sort({ displayorder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            flavourModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limitNumber);

        return res.status(200).json({
            success: true,
            flavours,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            },
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const searchFlavours = async (req, res) => {
    try {
        const {
            search = "",
            page = 1,
            limit = 10,
            status,
        } = req.query;

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const filter = {};

        if (search.trim()) {
            filter.name = {
                $regex: search.trim(),
                $options: "i",
            };
        }

        if (status !== undefined && status !== "") {
            filter.status = status;
        }

        const [flavours, total] = await Promise.all([
            flavourModel
                .find(filter)
                .sort({ displayorder: 1, createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .lean(),

            flavourModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limitNumber);

        return res.status(200).json({
            success: true,
            message: "Flavours fetched successfully",
            data: flavours,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPrevPage: pageNumber > 1,
            },
        });
    } catch (err) {
        console.error("Search Flavours Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
