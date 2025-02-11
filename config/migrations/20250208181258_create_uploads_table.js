exports.up = function(knex) {
    return knex.schema.createTable('uploads', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable(); // Original file name
      table.string('file').notNullable(); // Stored file name
      table.string('type').notNullable(); // File type (image, video, audio, document)
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('uploads');
  };
  