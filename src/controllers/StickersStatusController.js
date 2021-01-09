const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "stickers_status";

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect(table).select("*");
    return response.status(StatusCodes.OK).json(dbResponse);
  },
};
