const dbConnect = require("../connection");

module.exports = {
  async updateRegisterWithID(table, data, id) {
    try {
      const response = await dbConnect(table)
        .where("id", "=", id)
        .update(data);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};
