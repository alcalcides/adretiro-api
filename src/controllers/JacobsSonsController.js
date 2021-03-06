const { StatusCodes } = require("http-status-codes");
const { readTable } = require("../database/interface/read");
const table = "jacobs_sons";

module.exports = {
  async read(req, res) {
    
    const dbResponse = await readTable(table)
    return res.status(StatusCodes.OK).json(dbResponse);
  },
};
