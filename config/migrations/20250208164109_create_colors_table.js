exports.up = function(knex) {
    return knex.schema.createTable('colors', function(table) {
      table.uuid('id').primary();
      table.string('name').notNullable().unique();
      table.string('hex').notNullable().unique();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('colors');
  };
  