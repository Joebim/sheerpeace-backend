exports.up = function (knex) {
  return knex.schema.createTable("product_answers", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("question_id")
      .references("id")
      .inTable("product_questions")
      .onDelete("CASCADE");
    table
      .uuid("user_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL"); // Optional: Answered by user/admin
    table.text("answer").notNullable();
    table.boolean("is_admin_answer").defaultTo(false); // Helps distinguish admin answers
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_answers");
};
