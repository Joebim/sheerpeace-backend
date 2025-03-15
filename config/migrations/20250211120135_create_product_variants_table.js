exports.up = function (knex) {
  return knex.schema.createTable("product_variants", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("product_id")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("type").notNullable();
    table.uuid("color").references("id").inTable("colors").onDelete("CASCADE");
    table
      .uuid("image_id")
      .references("id")
      .inTable("uploads")
      .onDelete("CASCADE"); // References the uploads table
    table.integer("stock").defaultTo(0);
    table.decimal("price", 10, 2).notNullable();
    table.specificType("selected_materials", "UUID[]").defaultTo("{}"); // Selected materials
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_variants");
};
