const { StatusCodes } = require("http-status-codes");
const { readTable, findRegister } = require("../database/interface/read");
const { createRegister } = require("../database/interface/create");
const table = "people";

module.exports = {
  async read(req, res) {
    readTable(table).then((dbResponse) => {
      return res.status(StatusCodes.OK).json(dbResponse);
    });
  },
  async findByID(req, res) {
    const { id } = req.params
    const dbResponse = await findRegister(table, "id", id)
    return res.status(StatusCodes.OK).json(dbResponse);    
  },
  async createPeople(data) {
    return createRegister(table, data);
  },
};
