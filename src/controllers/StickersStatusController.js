import { StatusCodes } from "http-status-codes";
import { readTable, findRegister } from "../database/interface/read.js";
const table = "stickers_status";

export async function list(req, res) {
  const dbResponse = await readTable(table);
  return res.status(StatusCodes.OK).json(dbResponse);
}
export async function getStatusCodeOf(status) {
  return await findRegister(table, "status", status);
}
