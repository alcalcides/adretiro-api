export function up(knex) {
  return knex.schema.createTable("enrollments", (table) => {
    table.increments("id").primary();
    table.integer("fk_people").notNullable();
    table.integer("fk_department").notNullable();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_people").references("id").inTable("people");
    table.foreign("fk_department").references("id").inTable("departments");
  });
}

export function down(knex) {
  return knex.schema.dropTable("enrollments");
}
