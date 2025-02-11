exports.up = function (knex) {
    return knex.schema.createTable('payments', (table) => {
      table.increments('id').primary(); // Unique identifier
      table
        .uuid('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE'); // Reference to the order
      table.decimal('amount', 10, 2).notNullable(); // Payment amount
      table.string('payment_method').notNullable(); // Payment method (e.g., "credit_card", "paypal")
      table.string('status').notNullable().defaultTo('pending'); // Payment status
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('payments');
  };