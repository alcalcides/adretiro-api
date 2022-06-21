import { StatusCodes } from "http-status-codes";
import { findRegister } from "../database/interface/read.js";
import { createRegister } from "../database/interface/create.js";
import errorMessage from "./utils/errorMessages.js";
import { updateRegisterWithID } from "../database/interface/update.js";
const table = "people";

export async function read(req, res) {
  try {
    const { username } = req.query;
    const peopleData = await findRegister(table, "username", username);

    if (!peopleData)
      throw new Error(errorMessage.dataOutOfRange);

    const {
      id, full_name, birthday, mothers_full_name, email, whatsapp, } = peopleData;

    return res.status(StatusCodes.OK).json({
      id,
      full_name,
      username,
      birthday,
      mothers_full_name,
      email,
      whatsapp,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
}
export async function findByID_REST(req, res) {
  const { id } = req.params;
  const dbResponse = await findRegister(table, "id", id);
  return res.status(StatusCodes.OK).json(dbResponse);
}
export async function findByID(id) {
  return await findRegister(table, "id", id);
}
export async function findByUsername(username) {
  return await findRegister(table, "username", username);
}
export async function createPeople(data) {
  return createRegister(table, data);
}
export function validateUsername(username) {
  if (!username) {
    return { error: errorMessage.lackOfUsername };
  }

  return true;
}
export async function updatePeople(data, id) {
  try {
    const response = await updateRegisterWithID(table, data, id);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
