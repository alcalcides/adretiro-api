import { StatusCodes } from "http-status-codes";
import { readTable, listColumn, findRegister } from "../database/interface/read.js";
const table = "departments";

export async function read(req, res) {
  const dbResponse = await readTable(table);
  return res.status(StatusCodes.OK).json(dbResponse);
}
export async function listDepartments(req, res) {
  const dbResponse = await listColumn("name", table);
  const departments = dbResponse.map((departament) => departament.name);
  return res.status(StatusCodes.OK).json(departments);
}
export async function getDepartment(id) {
  const dbResponse = await findRegister(table, "id", id);
  return dbResponse;
}
