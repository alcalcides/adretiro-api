const { StatusCodes } = require("http-status-codes");
const {
  readTable,
  listColumn,
  findRegister,
} = require("../database/interface/read");
const table = "departments";

module.exports = {
  async read(req, res) {
    const dbResponse = await readTable(table);
    return res.status(StatusCodes.OK).json(dbResponse);
  },
  async listDepartments(req, res) {
    const dbResponse = await listColumn("name", table);
    const departments = dbResponse.map((departament) => departament.name);
    return res.status(StatusCodes.OK).json(departments);
  },
  async getDepartment(id) {
    const dbResponse = await findRegister(table, "id", id);
    return dbResponse;
  },
};
