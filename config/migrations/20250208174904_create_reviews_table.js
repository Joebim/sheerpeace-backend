exports.up = function(knex) {
    return knex.schema.createTable('reviews', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
      table.integer('rating').notNullable().checkBetween([1, 5]); // Ensure rating is between 1 and 5
      table.text('comment').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('reviews');
  };
  