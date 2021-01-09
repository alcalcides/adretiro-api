const dbConnect = require("../database/connection");
const { StatusCodes } = require("http-status-codes");
const table = "departments"

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect(table).select("*");
    return response.status(StatusCodes.OK).json(dbResponse);
  },
  async listDepartments(request, response) {
    
    const dbResponse = await dbConnect(table).select("name");
    const departments = dbResponse.map(departament => departament.name);
    return response.status(StatusCodes.OK).json(departments);
  },
};
