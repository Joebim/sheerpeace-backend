exports.up = function (knex) {
    return knex.schema.createTable('messages', (table) => {
      table.increments('id').primary(); // Unique identifier
      table
        .uuid('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // Reference to the user
      table.string('subject').notNullable(); // Message subject
      table.text('body').notNullable(); // Message body
      table.boolean('is_read').defaultTo(false); // Whether the message is read
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('messages');
  };