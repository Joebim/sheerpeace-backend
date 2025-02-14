const Brand = require('../models/brand.model');

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.getAll();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a brand by ID with full details
exports.getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.getById(id);

    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Fetch additional details
    const images = await Brand.getBrandImages(id);
    const featuredProducts = await Brand.getFeaturedProducts(id);
    const categories = await Brand.getCategories(id);

    res.json({
      ...brand,
      logo: images.logo,
      bannerImage: images.bannerImage,
      featuredProducts,
      categories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      logo,
      bannerImage,
      establishedYear,
      headquarters,
      website,
      contactEmail,
      socialLinks,
      categories,
      featuredProducts,
      missionStatement,
      values,
    } = req.body;

    const [brand] = await Brand.create({
      name,
      slug,
      description,
      logo,
      bannerImage,
      establishedYear,
      headquarters,
      website,
      contactEmail,
      socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
      categories: categories ? JSON.stringify(categories) : null,
      featuredProducts: featuredProducts ? JSON.stringify(featuredProducts) : null,
      missionStatement,
      values: values ? JSON.stringify(values) : null,
    });

    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Handle JSON fields
    if (data.socialLinks) data.socialLinks = JSON.stringify(data.socialLinks);
    if (data.categories) data.categories = JSON.stringify(data.categories);
    if (data.featuredProducts) data.featuredProducts = JSON.stringify(data.featuredProducts);
    if (data.values) data.values = JSON.stringify(data.values);

    const [brand] = await Brand.update(id, data);
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    await Brand.delete(id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create multiple brands
exports.createMultipleBrands = async (req, res) => {
  try {
    const brands = req.body;
    if (!Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({ message: 'Invalid input. Expected an array of brands.' });
    }
    const newBrands = await Brand.createMultiple(brands);
    res.status(201).json(newBrands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};