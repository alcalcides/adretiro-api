function deleteTable(tableName, knex) {
  return knex(tableName).del();
}

exports.deleteTable = deleteTable;
