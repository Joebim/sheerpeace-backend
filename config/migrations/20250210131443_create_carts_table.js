exports.up = function (knex) {
    return knex.schema.createTable('carts', (table) => {
      table.increments('id').primary(); // Unique identifier
      table
        .uuid('user_id') // Keep as `integer` if `users.id` is `integer`
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // Reference to the user
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('carts');
  };
  