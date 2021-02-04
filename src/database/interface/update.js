const dbConnect = require("../connection");

module.exports = {
  async updateRegisterWithID(table, data, id) {
    return await dbConnect(table).where("id", "=", id).update(data);
  },
};
