const { StatusCodes } = require("http-status-codes");

module.exports = {
  helloWorld(req, res) {
    return res.status(StatusCodes.OK).send("<h1>Hello World</h1>");
  },
};
