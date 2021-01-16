const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { readTable } = require("../database/interface/read");
const { getAccountBalance } = require("./ContributorsController");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "reward_requests";

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const { id } = req.body;
    const { created_at, updated_at } = getDBTimes();
    
    /*
    
    PROCESSAMENTO DE DADOS
    TRANSACTIONS

    */

    const data = { fk_contributor: id, created_at, updated_at };

    const fb = await createRegister(table, data);
    res.status(StatusCodes.OK).json(fb);
  },
};
