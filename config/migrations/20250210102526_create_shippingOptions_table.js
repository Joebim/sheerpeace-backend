exports.up = function (knex) {
    return knex.schema.createTable('shipping_options', (table) => {
      table.increments('id').primary(); // Unique identifier
      table.string('name').notNullable().unique(); // Shipping option name (e.g., "Standard", "Express")
      table.decimal('price', 10, 2).notNullable(); // Shipping price
      table.integer('delivery_time').notNullable(); // Delivery time in days
      table.text('description').nullable(); // Optional description
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('shipping_options');
  };