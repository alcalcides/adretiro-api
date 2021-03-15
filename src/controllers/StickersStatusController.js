const { readTable, findRegister } = require("../database/interface/read");
const { StatusCodes } = require("http-status-codes");
const table = "stickers_status";

module.exports = {
  async list(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },  
  async getStatusCodeOf(status) {
    return await findRegister(table, "status", status);
  }
};
