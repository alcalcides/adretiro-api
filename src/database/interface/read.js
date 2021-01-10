const dbConnect = require("../connection");

module.exports = {
  async readTable(table) {
    return dbConnect(table).select("*");
  },
  async findRegister(table, column, value) {
    return dbConnect(table).select("*").where(column, value).first();
  },
  async findRegister2(table, column1, value1, column2, value2) {
    return dbConnect(table)
      .select("*")
      .where(column1, value1)
      .where(column2, value2);
  },
  async listColumn(column, table) {
    return dbConnect(table).select(column);
  },
};
