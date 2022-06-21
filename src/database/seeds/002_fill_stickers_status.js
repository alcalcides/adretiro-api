import { deleteTable } from "../utils/deleteTable.js";

const tableName = "stickers_status";

export function seed(knex) {
  return deleteTable(tableName, knex)
    .then(() => fillStickersStatus(knex));
}

function fillStickersStatus(knex) {
  return knex(tableName).insert([
    { id: 1,    status: "AVAILABLE" },
    { id: 2,    status: "RESERVED" },
    { id: 3,    status: "REVEALED" },
    { id: 4,    status: "ARCHIVED" }
  ]);
}
