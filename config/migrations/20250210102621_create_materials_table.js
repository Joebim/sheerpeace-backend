exports.up = function (knex) {
    return knex.schema.createTable('materials', (table) => {
      table.increments('id').primary(); // Unique identifier
      table.string('name').notNullable().unique(); // Material name
      table.text('description').nullable(); // Optional description
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('materials');
  };