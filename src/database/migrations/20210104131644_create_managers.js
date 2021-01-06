exports.up = (knex) => {
  return knex.schema.createTable("managers", (table) => {
    table.increments("id").primary();
    table.integer("fk_people").notNullable();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_people").references("id").inTable("people");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("managers");
};
