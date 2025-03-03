exports.up = function (knex) {
  return knex.schema.createTable("cart_items", (table) => {
    table.uuid("id").primary(); // Unique identifier
    table
      .uuid("cart_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("carts")
      .onDelete("CASCADE"); // Reference to the cart
    table
      .uuid("product_id")
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE"); // Reference to the product
    table.integer("quantity").notNullable().defaultTo(1); // Quantity of the product
    table.specificType("selected_sizes", "UUID[]").defaultTo("{}"); // Selected sizes
    table.specificType("selected_materials", "UUID[]").defaultTo("{}"); // Selected materials
    table.specificType("selected_colors", "UUID[]").defaultTo("{}"); // Selected colors
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Timestamp for creation
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("cart_items");
};
