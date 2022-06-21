export function up(knex) {
  return knex.schema.createTable("jacobs_sons", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();

    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable("jacobs_sons");
}
