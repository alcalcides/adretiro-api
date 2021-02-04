const dbConnect = require("../connection");

module.exports = {
  async deleteRegister(table, field, value) {
    return await dbConnect(table).where(field, value).del();
  },
};
