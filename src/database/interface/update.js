const dbConnect = require("../connection");

module.exports = {
  async updateRegisterWithID(table, data, id) {
    return await dbConnect(table).where("id", "=", id).update(data);
  },
  async updateRegisterWhere(table, data, column, operation, value) {
    return await dbConnect(table).where(column, operation, value).update(data);
  },
  async updateRegisterWhereAndWhere(
    table,
    data,
    column1,
    operation1,
    value1,
    column2,
    operation2,
    value2
  ) {
    return await dbConnect(table)
      .where(column1, operation1, value1)
      .where(column2, operation2, value2)
      .update(data);
  },
};
