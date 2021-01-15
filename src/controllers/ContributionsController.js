const { StatusCodes } = require("http-status-codes");
const { createRegister } = require("../database/interface/create");
const { readTable } = require("../database/interface/read");
const ErrorMessage = require("./utils/errorMessages");
const { getDBTimes } = require("./utils/getDBTimes");
const table = "contributions";

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const { fk_contributor, value } = req.body;
    const { created_at, updated_at } = getDBTimes();

    const data = {
      fk_contributor,
      fk_manager: req.id,
      value,
      created_at,
      updated_at,
    };
    
    createRegister(table, data)
      .then((dbResponse) => {
        return res.status(StatusCodes.CREATED).json(dbResponse);
      })
      .catch(() => {
        const feedback = { success: false, message: ErrorMessage.userWrong };
        return res.status(StatusCodes.BAD_REQUEST).json(feedback);
      });
  },
};
