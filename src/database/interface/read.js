import dbConnect from "../connection.js";

export async function readTable(table) {
  return dbConnect(table).select("*");
}
export async function findRegister(table, column, value) {
  return dbConnect(table).select("*").where(column, value).first();
}
export async function findRegisters(table, column, value) {
  return dbConnect(table).select("*").where(column, value);
}
export async function findRegister2(table, column1, value1, column2, value2) {
  return dbConnect(table)
    .select("*")
    .where(column1, value1)
    .where(column2, value2);
}
export async function listColumn(column, table) {
  return dbConnect(table).select(column);
}
export async function findDistincts(table, column) {
  return dbConnect(table).distinct(column).select("*").where(column, value).first();
}
