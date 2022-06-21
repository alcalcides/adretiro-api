import { deleteTable } from "../utils/deleteTable.js";

const tableName = "departments";

export function seed(knex) {
  return deleteTable(tableName, knex)
    .then(() => fillStickersStatus(knex));
}

function fillStickersStatus(knex) {
  return knex(tableName).insert([
    { id: 1,    name: "OUTROS" },
    { id: 2,    name: "ADOLESCENTES" },
    { id: 3,    name: "CRIANÇAS" },
    { id: 4,    name: "JOVENS" },
    { id: 5,    name: "NOVOS CONVERTIDOS" },
    { id: 6,    name: "SENHORAS" },
    { id: 7,    name: "SENHORES" }
  ]);
}
