exports.up = function(knex) {
    return knex.schema.createTable('wishlist', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
      table.unique(['user_id', 'product_id']);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('wishlist');
  };
  