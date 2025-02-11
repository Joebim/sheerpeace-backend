const Product = require('../models/product.model');
const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db('products')
      .select(
        'products.*',
        'categories.name as category',
        'subcategories.name as subCategory',
        'brands.name as brand',
        'collections.name as collection'
      )
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .leftJoin('subcategories', 'products.subcategory_id', 'subcategories.id')
      .leftJoin('brands', 'products.brand_id', 'brands.id')
      .leftJoin('collections', 'products.collection_id', 'collections.id');

    res.json(products.map(formatProductResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await db('products')
      .select(
        'products.*',
        'categories.name as category',
        'subcategories.name as subCategory',
        'brands.name as brand',
        'collections.name as collection'
      )
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .leftJoin('subcategories', 'products.subcategory_id', 'subcategories.id')
      .leftJoin('brands', 'products.brand_id', 'brands.id')
      .leftJoin('collections', 'products.collection_id', 'collections.id')
      .where('products.id', req.params.product_id)
      .first();

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProductResponse(product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const [product] = await db('products').insert(req.body).returning('*');
    res.status(201).json({ message: 'Product created successfully', product: formatProductResponse(product) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [product] = await db('products')
      .where({ id: req.params.product_id })
      .update(req.body)
      .returning('*');

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated successfully', product: formatProductResponse(product) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await db('products')
      .where({ id: req.params.product_id })
      .del()
      .returning('*');

    if (!deletedProduct.length) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProductStats = async (req, res) => {
  try {
    const { views, number_sold } = req.body;
    const product_id = req.params.product_id;

    const [updatedProduct] = await db('products')
      .where({ id: product_id })
      .update({
        views: db.raw('COALESCE(views, 0) + ?', [views || 0]),
        number_sold: db.raw('COALESCE(number_sold, 0) + ?', [number_sold || 0])
      })
      .returning('*');

    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product stats updated successfully', product: formatProductResponse(updatedProduct) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function formatProductResponse(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    subCategory: product.subCategory,
    brand: product.brand,
    collection: product.collection,
    views: product.views,
    likes: product.likes,
    is_featured: product.is_featured,
    number_sold: product.number_sold,
    average_rating: product.average_rating,
    total_reviews: product.total_reviews,
    discounted_price: product.discounted_price,
    discount_percentage: product.discount_percentage,
    discount_start_date: product.discount_start_date,
    discount_end_date: product.discount_end_date,
    is_discounted: product.is_discounted,
    images: product.images ? JSON.parse(product.images) : [],
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}
