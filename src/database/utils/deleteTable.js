export function deleteTable(tableName, knex) {
  return knex(tableName).del();
}

