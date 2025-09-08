import Category from '../models/category.js';

export const findAllCategories = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const query = Category.find();

  const categories = await query.skip(skip).limit(limit).lean();
  const total = await Category.countDocuments();

  return {
    data: categories,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

export const findCategoryById = async (id) => {
  return await Category.findById(id);
};

export const findCategoryByName = async (name) => {
  return await Category.findOne({ name: name.trim() });
};

export const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};
