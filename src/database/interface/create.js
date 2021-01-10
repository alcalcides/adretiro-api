const dbConnect = require("../connection");

module.exports = {
  async createRegister(table, data) {
    const [register] = await dbConnect(table).insert(data).returning("*");
    return register;
  },
};
