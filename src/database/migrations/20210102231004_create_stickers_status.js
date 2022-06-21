export function up(knex) {
  return knex.schema.createTable("stickers_status", (table) => {
    table.increments("id").primary();
    table.string("status");

    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable("stickers_status");
}
