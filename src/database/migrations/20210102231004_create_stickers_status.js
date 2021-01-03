exports.up = (knex) => {
  return knex.schema.createTable("stickers_status", (table) => {
    table.increments("id").primary();
    table.string("status");

    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("stickers_status");
};
