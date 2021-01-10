const dbConnect = require("../connection");

module.exports = {
  async readTable(table) {
    return dbConnect(table).select("*");
  },
  async findRegister(table, column, value) {
    return dbConnect(table).select("*").where(column, value).first();
  },
  async listColumn(column, table) {
    return dbConnect(table).select(column);
  },
};

