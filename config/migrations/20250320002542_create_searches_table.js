exports.up = function (knex) {
    return knex.schema.createTable("searches", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()")); // PostgreSQL UUID
      table.string("query").notNullable().index();
      table.integer("count").defaultTo(1); // Track frequency of searches
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable("searches");
  };
  