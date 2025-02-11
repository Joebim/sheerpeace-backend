exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.integer("stock").notNullable().defaultTo(0);
    table.uuid("brand_id").references("id").inTable("brands").onDelete("CASCADE");

    // Arrays for relationships
    table.specificType("category_ids", "UUID[]"); // Array of category IDs
    table.specificType("subcategory_ids", "UUID[]"); // Array of subcategory IDs
    table.specificType("size_ids", "UUID[]"); // Array of size IDs
    table.specificType("color_ids", "UUID[]"); // Array of color IDs

    // Product visibility & sales stats
    table.integer("views").defaultTo(0);
    table.integer("likes").defaultTo(0);
    table.boolean("is_featured").defaultTo(false);
    table.integer("number_sold").defaultTo(0);
    table.decimal("average_rating", 3, 2).defaultTo(0); // e.g., 4.5
    table.integer("total_reviews").defaultTo(0);

    // Discount-related fields
    table.decimal("discounted_price", 10, 2).nullable();
    table.decimal("discount_percentage", 5, 2).defaultTo(0);
    table.timestamp("discount_start_date").nullable();
    table.timestamp("discount_end_date").nullable();
    table.boolean("is_discounted").defaultTo(false);

    // Product images
    table.specificType("images", "TEXT[]"); // Array of image URLs

    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
