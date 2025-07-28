import Category from "../models/category.js";

// Add new category
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Both name and description are required" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({ success: true, message: "Category added", category });
  } catch (error) {
    console.error("Add category error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Category already exists" });
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category updated", category: updated });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCategoryStockShare = async (req, res) => {
  try {
    const stock = await Product.aggregate([
      {
        $group: {
          _id: "$category", // assuming 'category' field stores category ID
          totalStock: { $sum: "$stock" }, // or "$quantity" if that’s the field
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $project: {
          category: "$categoryDetails.name",
          value: "$totalStock",
        },
      },
    ]);

    res.json(stock);
  } catch (error) {
    console.error("Stock share error:", error);
    res.status(500).json({ success: false, message: "Internal error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
