exports.up = function (knex) {
    return knex.schema.createTable('order_items', (table) => {
      table.increments('id').primary(); // Unique identifier
      table
        .uuid('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE'); // Reference to the order
      table
        .uuid('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE'); // Reference to the product
      table.integer('quantity').notNullable(); // Quantity of the product
      table.decimal('price', 10, 2).notNullable(); // Price per unit
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('order_items');
  };