import * as categoryService from '../services/categoryService.js';

export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const categories = await categoryService.findAllCategories({
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res
      .status(400)
      .json({ message: 'Failed to create category', error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.findCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body,
    );
    if (!updatedCategory)
      return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(updatedCategory);
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update category', error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete category', error: err.message });
  }
};
