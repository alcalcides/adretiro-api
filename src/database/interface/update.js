import dbConnect from "../connection.js";

export async function updateRegisterWithID(table, data, id) {
  return await dbConnect(table).where("id", "=", id).update(data);
}
export async function updateRegisterWhere(table, data, column, operation, value) {
  return await dbConnect(table).where(column, operation, value).update(data);
}
export async function updateRegisterWhereAndWhere(table,
  data,
  column1,
  operation1,
  value1,
  column2,
  operation2,
  value2) {
  return await dbConnect(table)
    .where(column1, operation1, value1)
    .where(column2, operation2, value2)
    .update(data);
}
