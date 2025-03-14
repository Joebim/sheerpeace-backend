exports.up = function (knex) {
    return knex.schema.createTable("product_specifications", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("product_id").references("id").inTable("products").onDelete("CASCADE").notNullable();
      table.jsonb("specifications").notNullable().defaultTo("{}"); // Dynamic table structure
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("product_specifications");
  };
  