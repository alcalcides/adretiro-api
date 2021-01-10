const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { findRegister } = require("../database/interface/read");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "passwords";

module.exports = {
  async read(req, res) {
    const { id } = req.params;
    const dbResponse = await findRegister(table, "id", id);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(data) {
    const dbResponse = await createRegister(table, data);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
};
