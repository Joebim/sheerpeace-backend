exports.up = function (knex) {
    return knex.schema.createTable('materials', (table) => {
      table.uuid('id').primary(); // Unique identifier
      table.string('name').notNullable().unique(); // Material name
      table.text('description').nullable(); // Optional description
      table.uuid('material_image_id').references('id').inTable('uploads'); // Optional banner image (references uploads table)
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('materials');
  };