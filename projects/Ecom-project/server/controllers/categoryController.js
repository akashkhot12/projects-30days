const Category = require("../models/categoryModel");

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ msg: error.message });
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

      res.status(201).json({ msg: "Created Category." });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    
  },
};

module.exports = categoryController;
