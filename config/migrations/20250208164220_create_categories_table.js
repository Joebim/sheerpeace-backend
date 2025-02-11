exports.up = function (knex) {
  return knex.schema.createTable('categories', (table) => {
    table.uuid('id').primary(); // Unique identifier
    table.string('name').notNullable().unique(); // Category name
    table.uuid('image').references('id').inTable('uploads'); // Reference to the uploads table for the image
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('categories');
};