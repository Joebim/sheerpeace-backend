exports.up = function (knex) {
  return knex.schema.createTable('sizes', (table) => {
    table.uuid('id').primary(); // Unique identifier for size
    table.string('label').notNullable(); // Size label (e.g., S, M, L, XL)
    table.string('gender').notNullable(); // 'male' or 'female' to differentiate gender-specific sizes
    table.float('chest').nullable(); // Chest measurement for the size (optional, can be nullable)
    table.float('waist').nullable(); // Waist measurement for the size (optional, can be nullable)
    table.float('hips').nullable(); // Hip measurement for the size (optional, can be nullable)
    table.text('description').nullable(); // Optional description of the size
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the size was created
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('sizes');
};
