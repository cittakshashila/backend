import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "tk_backend",
  password: "bharath2974",
  port: 5432,
});
