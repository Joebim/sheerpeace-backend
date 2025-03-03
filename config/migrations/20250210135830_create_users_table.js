exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // User ID (UUID)
    table.string("first_name").notNullable(); // First name
    table.string("last_name").notNullable(); // Last name
    table.string("email").notNullable().unique(); // Unique email
    table.string("password").notNullable(); // Password
    table.enum("user_type", ["admin", "user"]).notNullable().defaultTo("user"); // User role
    table.string("phone_number").notNullable(); // Phone number

    // Address (optional)
    table.string("street");
    table.string("city");
    table.string("state");
    table.string("postal_code");
    table.string("country");
    table.string("nearest_bus_stop");

    // Profile image relation
    table.uuid("profile_image_id").references("id").inTable("uploads").onDelete("SET NULL"); // Foreign key to uploads table

    // Payment method
    table.string("preferred_payment_method").nullable(); // Can be null

    // Timestamps
    table.timestamps(true, true); // Adds created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
