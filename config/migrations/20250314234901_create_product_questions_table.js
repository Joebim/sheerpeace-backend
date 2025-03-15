exports.up = function (knex) {
    return knex.schema.createTable("product_questions", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("product_id").references("id").inTable("products").onDelete("CASCADE");
      table.uuid("user_id").references("id").inTable("users").onDelete("SET NULL"); // Optional: If a user asks the question
      table.text("question").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("product_questions");
  };
  