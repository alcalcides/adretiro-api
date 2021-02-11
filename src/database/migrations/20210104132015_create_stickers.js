exports.up = (knex) => {
  return knex.schema.createTable("stickers", (table) => {
    table.increments("id").primary();
    table.integer("fk_contributor");
    table.integer("fk_jacobs_son").notNullable();
    table.integer("fk_sticker_status").notNullable();
    table.string("label").unique();

    table.timestamp("created_at");
    table.timestamp("updated_at");

    table.foreign("fk_contributor").references("id").inTable("contributors");
    table.foreign("fk_jacobs_son").references("id").inTable("jacobs_sons");
    table.foreign("fk_sticker_status").references("id").inTable("stickers_status");
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("stickers");
};
