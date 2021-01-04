exports.up = (knex) => {
  return knex.schema.createTable("contributors", (table) => {
    table.increments("id").primary();
    table.integer("fk_people").notNullable();
    table.string("password_x");
    table.float("amount");
    table.float("account_balance");

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_people").references("id").inTable("people");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("contributors");
};
