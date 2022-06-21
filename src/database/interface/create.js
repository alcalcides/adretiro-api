import dbConnect from "../connection.js";

export async function createRegister(table, data) {
  const [register] = await dbConnect(table).insert(data).returning("*");
  return register;
}
