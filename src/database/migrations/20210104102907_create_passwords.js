export function up(knex) {
  return knex.schema.createTable("passwords", (table) => {
      table.increments("id").primary();
      table.string("hash");
      table.string("salt");
      table.integer("number_of_cycles");

      table.timestamp("created_at");
      table.timestamp("updated_at");
  });
}

export function down(knex) {
  return knex.schema.dropTable("passwords");
}
