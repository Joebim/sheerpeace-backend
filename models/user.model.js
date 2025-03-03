const { db } = require("../config/db");

// Get user by email
const getUserByEmail = async (email) => {
  return db("users").where({ email }).first();
};

// Get user by ID
const getUserById = async (id) => {
  const user = await db("users")
    .where({ id })
    .first()
    .select(
      "id",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "profile_image_id",
      "preferred_payment_method",
      "street",
      "city",
      "state",
      "postal_code",
      "country",
      "nearest_bus_stop",
      "user_type",
      "created_at",
      "updated_at"
    );
  const profileImage = user.profile_image_id
    ? await db("uploads").where({ id: user.profile_image_id }).first()
    : null;

  const userWithDetails = {
    ...user,
    profile_image: profileImage ? profileImage.file : null,
  };

  return userWithDetails;
};

// Update user by ID
const updateUser = async (id, data) => {
  const [updatedUser] = await db("users")
    .where({ id })
    .update(data)
    .returning([
      "id",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "profile_image_id",
      "preferred_payment_method",
      "street",
      "city",
      "state",
      "postal_code",
      "country",
      "nearest_bus_stop",
      "user_type",
      "created_at",
      "updated_at",
    ]);
  return updatedUser;
};

// Delete user by ID
const deleteUser = async (id) => {
  return db("users").where({ id }).del();
};

module.exports = {
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
};
