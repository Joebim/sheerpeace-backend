exports.up = function (knex) {
    return knex.schema.createTable('shipping_addresses', (table) => {
      table.uuid('id').primary(); // Unique identifier
      table
        .uuid('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE'); // Reference to the user
      table.string('address_line1').notNullable(); // Address line 1
      table.string('address_line2').nullable(); // Address line 2
      table.string('city').notNullable(); // City
      table.string('state').notNullable(); // State
      table.string('postal_code').notNullable(); // Postal code
      table.string('country').notNullable(); // Country
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('shipping_addresses');
  };