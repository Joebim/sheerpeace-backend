const { createUsersTable } = require("./models/users.model");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const users_router = require("./routes/users.routes.js");
const auth_router = require("./routes/auth.routes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", express.static(__dirname + "/public"));
app.use("/api/users", users_router);
app.use("/api/auth", auth_router);

// Initialize database
createUsersTable();

app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT}`);
});
