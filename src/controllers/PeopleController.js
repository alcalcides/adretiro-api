const { StatusCodes } = require("http-status-codes");
const { findRegister } = require("../database/interface/read");
const { createRegister } = require("../database/interface/create");
const ErrorMessage = require("./utils/errorMessages");
const { updateRegisterWithID } = require("../database/interface/update");
const table = "people";

module.exports = {
  async read(req, res) {
    try {
      const { username } = req.query;
      const peopleData = await findRegister(table, "username", username);

      if (!peopleData) throw new Error(ErrorMessage.dataOutOfRange);

      const {
        id,
        full_name,
        birthday,
        mothers_full_name,
        email,
        whatsapp,
      } = peopleData;

      return res.status(StatusCodes.OK).json({
        id,
        full_name,
        username,
        birthday,
        mothers_full_name,
        email,
        whatsapp,
      });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: error.message });
    }
  },
  async findByID_REST(req, res) {
    const { id } = req.params;
    const dbResponse = await findRegister(table, "id", id);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async findByID(id) {
    return await findRegister(table, "id", id);
  },
  async findByUsername(username) {
    return await findRegister(table, "username", username);
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
