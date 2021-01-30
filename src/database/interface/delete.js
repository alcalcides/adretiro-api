const dbConnect = require("../connection");

module.exports = {
  async deleteRegister(table, field, value) {
    const response = await dbConnect(table).where(field, '=', value).del();
    return response;
  },
};
