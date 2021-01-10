const { StatusCodes } = require("http-status-codes");
const { readTable } = require("../database/interface/read");
const { createRegister } = require("../database/interface/create");
const table = "people";

module.exports = {
  async read(req, res) {
    readTable(table).then((dbResponse) => {
      return res.status(StatusCodes.OK).json(dbResponse);
    });
  },
  async create(data) {
    return createRegister(table, data);
  },
};
