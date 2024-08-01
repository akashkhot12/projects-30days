const Category = require("../models/categoryModel");

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await Category.findOne({ name });

      if (category)
        return res.status(400).json({ msg: "Category already exists." });

      const newCategory = new Category({ name });

      await newCategory.save();

      return res.status(201).json({ msg: "Created Category." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);

      return res.status(200).json({ msg: "Deleted a Category" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryController;
