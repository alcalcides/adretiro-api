exports.up = (knex) => {
  return knex.schema.createTable("contributions", (table) => {
    table.increments("id").primary();
    table.integer("fk_contributor").notNullable();
    table.integer("fk_manager").notNullable();
    table.float("value").notNullable();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_contributor").references("id").inTable("contributors");
    table.foreign("fk_manager").references("id").inTable("managers");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("contributions");
};
