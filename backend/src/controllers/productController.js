import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Helper function to create unique slug
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all products with filtering, searching, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, ageGroup, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Category Filter (support Category ObjectId, Slug, or Alias Slugs)
    if (category) {
      const aliasMap = {
        'strollers': 'strollers-travel',
        'strollers-travel': 'strollers-travel',
        'nursery': 'baby-furniture',
        'nursery-cribs': 'baby-furniture',
        'baby-furniture': 'baby-furniture',
        'furniture': 'baby-furniture',
        'apparel': 'baby-clothing',
        'organic-apparel': 'baby-clothing',
        'baby-clothing': 'baby-clothing',
        'clothing': 'baby-clothing',
        'feeding': 'feeding-nursing',
        'feeding-gear': 'feeding-nursing',
        'feeding-nursing': 'feeding-nursing',
        'bath': 'bath-skincare',
        'bath-skincare': 'bath-skincare'
      };

      const targetSlug = aliasMap[category.toLowerCase()] || category;

      if (targetSlug.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = targetSlug;
      } else {
        const cat = await Category.findOne({ 
          $or: [{ slug: targetSlug }, { slug: category }] 
        });
        if (cat) {
          filter.category = cat._id;
        } else {
          return res.status(200).json({ products: [], page: Number(page), totalPages: 0, totalResults: 0 });
        }
      }
    }

    // Age Group Filter
    if (ageGroup) {
      filter.ageGroup = ageGroup;
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search by Name or Description (Case-insensitive Regex)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting Options
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { ratingsAverage: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    // Pagination math
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalResults = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limitNum);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      products,
      page: pageNum,
      totalPages,
      totalResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let product;
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      ageGroup,
      brand,
      isFeatured
    } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Please provide name, description, price, and category' });
    }

    const productSlug = slug ? createSlug(slug) : createSlug(name) + '-' + Date.now().toString().slice(-4);

    const product = await Product.create({
      name: name.trim(),
      slug: productSlug,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      category,
      images: Array.isArray(images) ? images : [],
      stock: stock !== undefined ? Number(stock) : 0,
      ageGroup: ageGroup || '0-6m',
      brand: brand || 'NK Enterprises',
      isFeatured: Boolean(isFeatured)
    });

    const populatedProduct = await product.populate('category', 'name slug');
    return res.status(201).json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      category,
      images,
      stock,
      ageGroup,
      brand,
      isFeatured
    } = req.body;

    if (name) {
      product.name = name.trim();
      if (slug) product.slug = createSlug(slug);
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
    if (category) product.category = category;
    if (images && Array.isArray(images)) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (ageGroup) product.ageGroup = ageGroup;
    if (brand) product.brand = brand;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

    const updatedProduct = await product.save();
    const populatedProduct = await updatedProduct.populate('category', 'name slug');
    return res.status(200).json(populatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
