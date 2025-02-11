exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // User ID (UUID)
    table.string("name").notNullable(); // User name
    table.string("email").notNullable().unique(); // User email (unique)
    table.string("password").notNullable(); // Password
    table.enum("user_type", ["admin", "user"]).notNullable().defaultTo("user"); // User type (admin or user)
    table.timestamps(true, true); // Timestamps for created_at and updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
