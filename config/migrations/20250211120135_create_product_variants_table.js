exports.up = function (knex) {
    return knex.schema.createTable("product_variants", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("product_id").references("id").inTable("products").onDelete("CASCADE");
      table.string("color").notNullable();
      table.uuid("image_id").references("id").inTable("uploads").onDelete("CASCADE"); // References the uploads table
      table.integer("stock").defaultTo(0);
      table.decimal("price", 10, 2).notNullable();
      
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("product_variants");
  };
  