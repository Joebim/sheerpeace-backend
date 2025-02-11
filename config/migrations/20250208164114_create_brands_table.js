exports.up = function (knex) {
  return knex.schema.createTable('brands', (table) => {
    table.uuid('id').primary(); // Unique identifier
    table.string('name').notNullable().unique(); // Brand name
    table.string('slug').notNullable().unique(); // URL-friendly name
    table.text('description'); // Short brand description
    table.uuid('logo').references('id').inTable('uploads'); // URL to brand logo (references uploads table)
    table.uuid('bannerImage').references('id').inTable('uploads'); // Optional banner image (references uploads table)

    // Business Information
    table.integer('establishedYear'); // Year founded
    table.string('headquarters'); // Brand location
    table.string('website'); // Official website
    table.string('contactEmail'); // Customer support email

    // Social Media
    table.json('socialLinks'); // Store social media links as JSON

    // Product & Category Info
    table.json('categories'); // IDs of categories (stored as JSON array)
    table.json('featuredProducts'); // IDs of featured products (stored as JSON array)
    table.integer('totalProducts').defaultTo(0); // Total product count

    // Ratings & Reviews
    table.float('averageRating').defaultTo(0); // 1-5 scale
    table.integer('totalReviews').defaultTo(0); // Number of reviews

    // Branding & Values
    table.text('missionStatement'); // Brand’s mission
    table.json('values'); // Core brand values (stored as JSON array)

    table.boolean('isActive').defaultTo(true); // Whether the brand is currently active
    table.timestamp('created_at').defaultTo(knex.fn.now()); // When the brand was added
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('brands');
};