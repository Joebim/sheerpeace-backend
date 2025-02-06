const { db } = require("../config/db");
const bcrypt = require("bcryptjs");

// Create Users Table if not exists
const createUsersTable = async () => {
    try {
        const exists = await db.schema.hasTable("users");
        if (!exists) {
            await db.schema.createTable("users", (table) => {
                table.uuid("id").primary().defaultTo(db.raw("gen_random_uuid()"));
                table.string("name").notNullable();
                table.string("email").notNullable().unique();
                table.string("password").notNullable();
                table.enum("user_type", ["admin", "user"]).notNullable().defaultTo("user");
                table.timestamps(true, true);
            });
            console.log("✅ Users table created successfully!");
        }
    } catch (error) {
        console.error("❌ Error creating users table:", error);
    }
};

// Insert New User
const createUser = async (userData) => {
    userData.password = await bcrypt.hash(userData.password, 10);
    const [user] = await db("users").insert(userData).returning("*");
    return user;
};

// Get User by Email
const getUserByEmail = async (email) => {
    return db("users").where({ email }).first();
};

module.exports = { createUsersTable, createUser, getUserByEmail };
