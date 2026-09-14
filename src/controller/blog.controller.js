import blogModel from "../model/blog.model.js";
import {uploadToCloudinary,deleteFromCloudinary} from "../utils/cloudinary.js";

const parseJSON = (value, fallback = null) => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const parseArray = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => String(item).trim())
                    .filter(Boolean);
            }
        } catch {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    return [];
};

const parseBoolean = (value, defaultValue = true) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
    }

    return Boolean(value);
};

const buildSEO = (seo) => {
    const seoObject = parseJSON(seo, {});

    return {
        metaTitle:
            typeof seoObject.metaTitle === "string"
                ? seoObject.metaTitle.trim()
                : "",

        metaDescription:
            typeof seoObject.metaDescription === "string"
                ? seoObject.metaDescription.trim()
                : "",

        keywords: parseArray(seoObject.keywords),

        canonicalUrl:
            typeof seoObject.canonicalUrl === "string" &&
            seoObject.canonicalUrl.trim()
                ? seoObject.canonicalUrl.trim()
                : null,

        ogTitle:
            typeof seoObject.ogTitle === "string" &&
            seoObject.ogTitle.trim()
                ? seoObject.ogTitle.trim()
                : null,

        ogDescription:
            typeof seoObject.ogDescription === "string" &&
            seoObject.ogDescription.trim()
                ? seoObject.ogDescription.trim()
                : null,

        ogImage:
            typeof seoObject.ogImage === "string" &&
            seoObject.ogImage.trim()
                ? seoObject.ogImage.trim()
                : null,

        twitterTitle:
            typeof seoObject.twitterTitle === "string" &&
            seoObject.twitterTitle.trim()
                ? seoObject.twitterTitle.trim()
                : null,

        twitterDescription:
            typeof seoObject.twitterDescription === "string" &&
            seoObject.twitterDescription.trim()
                ? seoObject.twitterDescription.trim()
                : null,

        twitterImage:
            typeof seoObject.twitterImage === "string" &&
            seoObject.twitterImage.trim()
                ? seoObject.twitterImage.trim()
                : null,

        facebookTitle:
            typeof seoObject.facebookTitle === "string" &&
            seoObject.facebookTitle.trim()
                ? seoObject.facebookTitle.trim()
                : null,

        facebookDescription:
            typeof seoObject.facebookDescription === "string" &&
            seoObject.facebookDescription.trim()
                ? seoObject.facebookDescription.trim()
                : null,

        facebookImage:
            typeof seoObject.facebookImage === "string" &&
            seoObject.facebookImage.trim()
                ? seoObject.facebookImage.trim()
                : null,
    };
};

export const addBlog = async (req, res) => {
    try {
        let {
            slug,
            title,
            description,
            content,
            seo,
            status,
        } = req.body;

        const imageFile = req.file;

        if (!slug || !title || !description || !content || !seo) {
            return res.status(400).json({
                success: false,
                message:
                    "Slug, title, description, content and SEO are required.",
            });
        }

        slug = String(slug).trim();
        title = String(title).trim();
        description = String(description).trim();
        content = String(content).trim();

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required.",
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required.",
            });
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required.",
            });
        }

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required.",
            });
        }

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Blog image is required.",
            });
        }

        const seoObject = buildSEO(seo);

        if (!seoObject.metaTitle) {
            return res.status(400).json({
                success: false,
                message: "SEO metaTitle is required.",
            });
        }

        if (!seoObject.metaDescription) {
            return res.status(400).json({
                success: false,
                message: "SEO metaDescription is required.",
            });
        }

        if (seoObject.metaTitle.length > 60) {
            return res.status(400).json({
                success: false,
                message: "SEO metaTitle must not exceed 60 characters.",
            });
        }

        if (seoObject.metaDescription.length > 160) {
            return res.status(400).json({
                success: false,
                message:
                    "SEO metaDescription must not exceed 160 characters.",
            });
        }

        const existingBlog = await blogModel.findOne({ slug });

        if (existingBlog) {
            return res.status(409).json({
                success: false,
                message: "Slug already exists.",
            });
        }

        const uploadResult = await uploadToCloudinary(
            imageFile.buffer,
            "blogs"
        );

        const blog = await blogModel.create({
            slug,
            title,
            description,
            image: uploadResult.secure_url,
            content,
            seo: seoObject,
            status: parseBoolean(status, true),
        });

        return res.status(201).json({
            success: true,
            message: "Blog added successfully.",
            data: blog,
        });
    } catch (err) {
        console.error("Add blog error:", err);

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Slug already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add blog.",
            error: err.message,
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "BlogId is required.",
            });
        }

        const blogDetails = await blogModel.findById(id);

        if (!blogDetails) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        let {
            slug,
            title,
            description,
            content,
            seo,
            status,
        } = req.body;

        const imageFile = req.file;

        if (slug !== undefined) {
            slug = String(slug).trim();

            if (!slug) {
                return res.status(400).json({
                    success: false,
                    message: "Slug cannot be empty.",
                });
            }

            const existingBlog = await blogModel.findOne({
                slug,
                _id: { $ne: id },
            });

            if (existingBlog) {
                return res.status(409).json({
                    success: false,
                    message: "Slug already exists.",
                });
            }

            blogDetails.slug = slug;
        }

        if (title !== undefined) {
            title = String(title).trim();

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: "Title cannot be empty.",
                });
            }

            blogDetails.title = title;
        }

        if (description !== undefined) {
            description = String(description).trim();

            if (!description) {
                return res.status(400).json({
                    success: false,
                    message: "Description cannot be empty.",
                });
            }

            blogDetails.description = description;
        }

        if (content !== undefined) {
            content = String(content).trim();

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: "Content cannot be empty.",
                });
            }

            blogDetails.content = content;
        }

        if (seo !== undefined) {
            const seoObject = buildSEO(seo);

            if (!seoObject.metaTitle) {
                return res.status(400).json({
                    success: false,
                    message: "SEO metaTitle is required.",
                });
            }

            if (!seoObject.metaDescription) {
                return res.status(400).json({
                    success: false,
                    message: "SEO metaDescription is required.",
                });
            }

            if (seoObject.metaTitle.length > 60) {
                return res.status(400).json({
                    success: false,
                    message:
                        "SEO metaTitle must not exceed 60 characters.",
                });
            }

            if (seoObject.metaDescription.length > 160) {
                return res.status(400).json({
                    success: false,
                    message:
                        "SEO metaDescription must not exceed 160 characters.",
                });
            }

            blogDetails.seo = seoObject;
        }

        if (status !== undefined) {
            blogDetails.status = parseBoolean(
                status,
                blogDetails.status
            );
        }

        if (imageFile) {
            const oldImage = blogDetails.image;

            const uploadResult = await uploadToCloudinary(
                imageFile.buffer,
                "blogs"
            );

            blogDetails.image = uploadResult.secure_url;

            if (oldImage) {
                try {
                    await deleteFromCloudinary(oldImage);
                } catch (deleteError) {
                    console.error(
                        "Failed to delete old blog image:",
                        deleteError
                    );
                }
            }
        }

        await blogDetails.save();

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully.",
            data: blogDetails,
        });
    } catch (err) {
        console.error("Update blog error:", err);

        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Slug already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update blog.",
            error: err.message,
        });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const page = Math.max(
            parseInt(req.query.page) || 1,
            1
        );

        const limit = Math.max(
            parseInt(req.query.limit) || 10,
            1
        );

        const search = req.query.search?.trim() || "";

        const skip = (page - 1) * limit;

        const filter = search
            ? {
                $or: [
                    {
                        slug: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        title: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        description: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        content: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        "seo.metaTitle": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        "seo.metaDescription": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            }
            : {};

        const [blogs, totalBlogs] = await Promise.all([
            blogModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            blogModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(
            totalBlogs / limit
        );

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully.",
            data: blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });
    } catch (err) {
        console.error("Get blogs error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blogs.",
            error: err.message,
        });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required.",
            });
        }

        const blog = await blogModel.findOne({
            slug: slug.trim(),
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog fetched successfully.",
            data: blog,
        });
    } catch (err) {
        console.error("Get blog by slug error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog.",
            error: err.message,
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "BlogId is required.",
            });
        }

        const blogDetails = await blogModel.findById(id);

        if (!blogDetails) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        await blogModel.findByIdAndDelete(id);

        if (blogDetails.image) {
            try {
                await deleteFromCloudinary(blogDetails.image);
            } catch (deleteError) {
                console.error(
                    "Failed to delete blog image from Cloudinary:",
                    deleteError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully.",
        });
    } catch (err) {
        console.error("Delete blog error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to delete blog.",
            error: err.message,
        });
    }
};