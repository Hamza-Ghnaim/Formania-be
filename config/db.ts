// config/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE as string,
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    logging: false, // set to true for SQL logs
  }
);
