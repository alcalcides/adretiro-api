const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "passwords";

module.exports = {
  async read(request, response) {
    const { id } = request.params;

    const dbResponse = await dbConnect(table)
      .select("*")
      .where("id", id)
      .first();

    return response.status(StatusCodes.OK).json(dbResponse);
  },

  

};
