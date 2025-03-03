exports.up = function (knex) {
    return knex.schema.createTable("featured_offerings", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("title").notNullable(); // Title for the banner
      table.text("description").nullable(); // Optional description
      table.uuid("image_url").references('id').inTable('uploads'); // Slider image
      table.string("link").notNullable(); // Path to redirect (category, product, etc.)
      
      // Array for product types (e.g., "shoes", "dresses", "accessories")
      table.specificType("keywords", "TEXT[]"); 
  
      // Filters
      table.boolean("is_featured").defaultTo(false);
      table.boolean("trending").defaultTo(false);
      table.boolean("is_new").defaultTo(false);
      table.boolean("top_selling").defaultTo(false);
      table.boolean("top_choice").defaultTo(false);
      table.decimal("rating", 3, 2).defaultTo(0);
      
      table.uuid("category_id").references("id").inTable("categories").onDelete("CASCADE");
      table.uuid("subcategory_id").references("id").inTable("subcategories").onDelete("CASCADE");
      table.boolean("is_discounted").defaultTo(false);
      
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("featured_offerings");
  };
  