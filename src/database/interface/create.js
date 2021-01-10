const dbConnect = require("../connection");

module.exports = {
  async createRegister(table, data) {
    return dbConnect(table).insert(data).returning("*");
  },
};
