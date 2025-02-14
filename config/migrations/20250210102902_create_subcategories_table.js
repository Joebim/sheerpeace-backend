exports.up = function (knex) {
  return knex.schema.createTable('colors', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()')); // Use UUID for the ID
    table.string('name').notNullable();
    table.string('hex').nullable(); // Make hex nullable
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('colors');
};