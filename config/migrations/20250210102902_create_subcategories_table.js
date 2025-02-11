exports.up = function (knex) {
    return knex.schema.createTable('subcategories', (table) => {
      table.uuid('id').primary(); // Unique identifier
      table.string('name').notNullable().unique(); // Subcategory name
      table
        .uuid('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE'); // Reference to the parent category
        table.uuid('image').nullable().references('id').inTable('uploads'); // Reference to the uploads table for the image
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for creation
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('subcategories');
  };