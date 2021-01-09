const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "jacobs_sons";

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect(table).select("*");
    return response.status(StatusCodes.OK).json(dbResponse);
  },
};
