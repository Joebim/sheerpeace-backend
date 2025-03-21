const Search = require("../models/search.model");

exports.addSearch = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    await Search.addOrUpdateQuery(query);
    res.status(201).json({ message: "Search recorded" });
  } catch (error) {
    console.error("Error adding search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const { term } = req.query;
    // if (!term) return res.status(400).json({ error: "Search term is required" });

    const suggestions = await Search.getSuggestions(term);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addMultipleSearches = async (req, res) => {
    try {
      const { queries } = req.body;
      if (!Array.isArray(queries) || queries.length === 0) {
        return res.status(400).json({ error: "Queries must be a non-empty array" });
      }

      await Search.addMultipleSearches(queries);
      res.status(201).json({ message: "Searches added successfully" });
    } catch (error) {
      console.error("Error adding multiple searches:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };