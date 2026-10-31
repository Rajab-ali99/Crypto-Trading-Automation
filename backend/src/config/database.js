import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({
  adapter,
});

export const connectDB = async () => {
  try {
    await prisma.$connect();

    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
};

export default prisma;