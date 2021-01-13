const { StatusCodes } = require("http-status-codes");
const { readTable } = require("../database/interface/read");
const { findRegister } = require("../database/interface/read");
const table = "managers";

module.exports = {
  async read(req, res) {
    
    const dbResponse = await readTable(table)
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async findByFKPeople(fk_people) {
    const dbResponse = await findRegister(table, "fk_people", fk_people);
    return dbResponse;
  },
};
