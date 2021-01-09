exports.up = (knex) => {
  return knex.schema.createTable("people", (table) => {
    table.increments("id").primary();
    table.integer("fk_password").notNullable();
    table.string("full_name").notNullable();
    table.string("username").notNullable().unique();
    table.date("birthday");
    table.string("mothers_full_name");
    table.string("email").unique().nullable();
    table.string("whatsapp").unique().nullable();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_password").references("id").inTable("passwords");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("people");
};
