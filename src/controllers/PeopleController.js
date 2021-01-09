const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "people"; 

module.exports = {

  async read(req, res) {
    
    const dbResponse = await dbConnect(table).select("*");
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async create(req, res) {
    const data = req.body
    const dbResponse = await dbConnect(table).insert();
    return res.status(StatusCodes.OK).json(dbResponse);
  },
};
