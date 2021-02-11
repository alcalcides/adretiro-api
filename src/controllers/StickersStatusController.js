const { readTable } = require("../database/interface/read");
const { StatusCodes } = require("http-status-codes");
const table = "stickers_status";

module.exports = {
  async list(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
};
