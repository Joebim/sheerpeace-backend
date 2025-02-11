exports.up = function (knex) {
    return knex.schema.createTable('cart_items', (table) => {
      table.increments('id').primary(); // Unique identifier
      table
        .integer('cart_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('carts')
        .onDelete('CASCADE'); // Reference to the cart
      table
        .uuid('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE'); // Reference to the product
      table.integer('quantity').notNullable().defaultTo(1); // Quantity of the product
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('cart_items');
  };