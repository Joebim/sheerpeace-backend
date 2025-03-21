const express = require("express");
const {
  addSearch,
  getSuggestions,
  addMultipleSearches,
} = require("../controllers/search.controller");
const router = express.Router();

router.post("/", addSearch);
router.post("/multiple", addMultipleSearches);
router.get("/", getSuggestions);

module.exports = router;
