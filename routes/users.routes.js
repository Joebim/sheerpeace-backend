const express = require("express");
const { posts } = require("../config/db.js");
const {
    getAllPosts
} = require("../controllers/users.controllers.js");

const router = express.Router();

// i.e. to show all the data
router.get("/posts", getAllPosts);

module.exports = router;