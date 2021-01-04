exports.up = (knex) => {
  return knex.schema.createTable("reward_requests", (table) => {
    table.increments("id").primary();
    table.integer("fk_contributor").notNullable();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_contributor").references("id").inTable("contributors");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("reward_requests");
};
