import knex from "knex";
import { production, development } from "../../knexfile.js";

const dbConnect = process.env.DATABASE_URL
  ? knex(production)
  : knex(development);

export default dbConnect