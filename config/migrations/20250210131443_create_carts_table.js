exports.up = function (knex) {
  return knex.schema.createTable("carts", (table) => {
    table.uuid("id").primary(); // Unique identifier
    table
      .uuid("user_id") // Keep as `uuid` since `users.id` is `uuid`
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE"); // Reference to the user
    table.specificType("cartItem_ids", "UUID[]");
    table.integer("total_items").defaultTo(0); // Total number of items in cart
    table.decimal("total_price", 10, 2).defaultTo(0.0); // Total price of items in cart
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Timestamp for creation
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("carts");
};
