import dbConnect from "../connection.js";

export async function deleteRegister(table, field, value) {
  return await dbConnect(table).where(field, value).del();
}
