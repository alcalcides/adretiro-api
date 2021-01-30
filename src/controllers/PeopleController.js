const { StatusCodes } = require("http-status-codes");
const { readTable, findRegister } = require("../database/interface/read");
const { createRegister } = require("../database/interface/create");
const ErrorMessage = require("./utils/errorMessages");
const { updateRegisterWithID } = require("../database/interface/update");
const table = "people";

module.exports = {
  async read(req, res) {
    readTable(table).then((dbResponse) => {
      return res.status(StatusCodes.OK).json(dbResponse);
    });
  },
  async findByID(req, res) {
    const { id } = req.params;
    const dbResponse = await findRegister(table, "id", id);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async findByUsername(username) {
    return new Promise((resolve, reject) => {
      findRegister(table, "username", username)
        .then((value) => resolve(value))
        .catch((reason) => reject(reason));
    });
  },
  async createPeople(data) {
    return createRegister(table, data);
  },
  validateUsername(username) {
    if (!username) {
      return { error: ErrorMessage.lackOfUsername };
    }

    return true;
  },
  async updatePeople(data, id) {
    try {
      const response = await updateRegisterWithID(table, data, id);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  },
};
