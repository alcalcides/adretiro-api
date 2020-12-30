const { deleteTable } = require("../utils/deleteTable");

const tableName = "jacobs_sons";

exports.seed = (knex) => {
  return deleteTable(tableName, knex)
    .then(() => fillJacobsSons(knex));
};

function fillJacobsSons(knex) {
  return knex(tableName).insert([
    { id: 1,    name: "RÚBEN" },
    { id: 2,    name: "SIMEÃO" },
    { id: 3,    name: "LEVI" },
    { id: 4,    name: "JUDÁ" },
    { id: 5,    name: "DÃ" },
    { id: 6,    name: "NAFTALI" },
    { id: 7,    name: "GADE" },
    { id: 8,    name: "ASER" },
    { id: 9,    name: "ISSACAR" },
    { id: 10,   name: "ZEBULOM" },
    { id: 11,   name: "JOSÉ" },
    { id: 12,   name: "BENJAMIM" },
  ]);
}
