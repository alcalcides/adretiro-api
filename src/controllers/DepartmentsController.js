const dbConnect = require("../database/connection");

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect("departments").select("*");
    return response.status(200).json(dbResponse);
  },
  async listDepartments(request, response) {
    
    const dbResponse = await dbConnect("departments").select("name");
    const departments = dbResponse.map(departament => departament.name);
    return response.status(200).json(departments);
  },
};
