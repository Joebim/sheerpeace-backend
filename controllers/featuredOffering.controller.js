const FeaturedOffering = require("../models/featuredOffering.model");

const getAllFeatured = async (req, res) => {
  try {
    const offerings = await FeaturedOffering.getAll();
    res.status(200).json(offerings);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch featured offerings: ${error}` });
  }
};

const getFeaturedById = async (req, res) => {
  try {
    const offering = await FeaturedOffering.getById(req.params.id);
    if (!offering) {
      return res.status(404).json({ error: "Featured offering not found" });
    }
    res.status(200).json(offering);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch featured offering: ${error}` });
  }
};

const createFeatured = async (req, res) => {
  try {
    const newOffering = await FeaturedOffering.create(req.body);
    res.status(201).json(newOffering);
  } catch (error) {
    res.status(500).json({ error: `Failed to create featured offering: ${error}` });
  }
};

const updateFeatured = async (req, res) => {
  try {
    const updatedOffering = await FeaturedOffering.update(req.params.id, req.body);
    if (!updatedOffering) {
      return res.status(404).json({ error: "Featured offering not found" });
    }
    res.status(200).json(updatedOffering);
  } catch (error) {
    res.status(500).json({ error: "Failed to update featured offering" });
  }
};

const deleteFeatured = async (req, res) => {
  try {
    const deleted = await FeaturedOffering.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Featured offering not found" });
    }
    res.status(200).json({ message: "Featured offering deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete featured offering" });
  }
};

const queryFeatured = async (req, res) => {
  try {
    const filters = req.query;
    console.log("Received filters:", filters);

    const offerings = await FeaturedOffering.queryFeatured(filters);
    res.json(offerings);
  } catch (error) {
    console.error("Error querying featured offerings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllFeatured,
  getFeaturedById,
  createFeatured,
  updateFeatured,
  deleteFeatured,
  queryFeatured,
};
