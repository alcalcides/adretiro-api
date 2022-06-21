export function up(knex) {
  return knex.schema.createTable("departments", (table) => {
    table.increments("id").primary();
    table.string("name");

    table.timestamps(true, true);
  })
}

export function down(knex) {
  return knex.schema.dropTable("departments");
}
