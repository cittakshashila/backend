import dotenv from "dotenv"
dotenv.config();

export const SECRET = process.env.TOKEN_SECRET || ""
