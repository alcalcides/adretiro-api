const knex = require("knex");
const environments = require("../../knexfile");

const dbConnect = process.env.DATABASE_URL
  ? knex(environments.production)
  : knex(environments.development);

module.exports = dbConnect;
