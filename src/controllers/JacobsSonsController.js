import { StatusCodes } from "http-status-codes";
import { readTable } from "../database/interface/read.js";
const table = "jacobs_sons";

export async function read(req, res) {

  const dbResponse = await readTable(table);
  return res.status(StatusCodes.OK).json(dbResponse);
}
