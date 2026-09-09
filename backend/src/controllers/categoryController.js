import Category from '../models/Category.js';

// Helper function to generate slug from name
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, slug } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const categorySlug = slug ? createSlug(slug) : createSlug(name);

    const existingCategory = await Category.findOne({
      $or: [{ name: name.trim() }, { slug: categorySlug }]
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name or slug already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: categorySlug,
      description: description || '',
      image: image || ''
    });

    return res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, slug } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name.trim();
      category.slug = slug ? createSlug(slug) : createSlug(name);
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;

    const updatedCategory = await category.save();
    return res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
