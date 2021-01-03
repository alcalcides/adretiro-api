const dbConnect = require("../database/connection");

module.exports = {
  async read(request, response) {
    
    const dbResponse = await dbConnect("stickers_status").select("*");
    return response.status(200).json(dbResponse);
  },
};
