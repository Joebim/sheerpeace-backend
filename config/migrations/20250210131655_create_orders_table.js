exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
      table.uuid('id').primary(); // Unique identifier
      table
        .uuid('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // Reference to the user
      table
        .uuid('shipping_address_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('shipping_addresses')
        .onDelete('CASCADE'); // Reference to the shipping address
      table.decimal('total_amount', 10, 2).notNullable(); // Total order amount
      table.string('status').notNullable().defaultTo('pending'); // Order status
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('orders');
  };