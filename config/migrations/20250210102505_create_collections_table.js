exports.up = function (knex) {
    return knex.schema.createTable('collections', (table) => {
      table.increments('id').primary(); // Unique identifier
      table.string('name').notNullable().unique(); // Collection name
      table.text('description').nullable(); // Optional description
      table.uuid('image').nullable().references('id').inTable('uploads'); // Corrected: `uuid` type for foreign key
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('collections');
  };
  