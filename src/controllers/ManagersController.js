import { StatusCodes } from "http-status-codes";
import { readTable } from "../database/interface/read.js";
import { findRegister } from "../database/interface/read.js";
const table = "managers";

export async function read(req, res) {

  const dbResponse = await readTable(table);
  return res.status(StatusCodes.OK).json(dbResponse);
}
export async function findByFKPeople(fk_people) {
  const dbResponse = await findRegister(table, "fk_people", fk_people);
  return dbResponse;
}
