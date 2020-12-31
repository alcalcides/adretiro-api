const dbConnect = require("../database/connection");

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect("jacobs_sons").select("*");
    return response.status(200).json(dbResponse);
  },
};
