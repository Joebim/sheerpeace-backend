const { users} = require("../config/db.js"); // users is the name of the table in your postgress DB

const {
    _getAllPosts
} = require("../models/users.models.js");

// i.e. to show all the data
const getAllPosts = async (req, res) => {
    try {
        const data = await _getAllPosts();
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(404).json({ msg: "No posts found." });
    }
};

module.exports = {
    getAllPosts
};