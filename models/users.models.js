const { db } = require("../config/db.js");

// i.e. to show all the data
const _getAllPosts = () => {
    return db("posts").select("id", "title", "content").orderBy("title");
};

module.exports = {
    _getAllPosts,
};