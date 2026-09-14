import categoryModel from "../model/blogCategory.model.js";
import blogModel from "../model/blog.model.js";


export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category || !Array.isArray(category)) {
      return res.status(400).json({
        success: false,
        message: "category must be an array",
      });
    }

    const newCategory = await categoryModel.create({
      category,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to get categories",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category || !Array.isArray(category)) {
      return res.status(400).json({
        success: false,
        message: "category must be an array",
      });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category exists
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Check if any blog is using this category
        const blogs = await blogModel.findOne({
            category: id,
        });

        if (blogs) {
            return res.status(400).json({
                success: false,
                message: "Category cannot be deleted because it is being used by a blog",
            });
        }

        // Delete category
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: deletedCategory,
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};