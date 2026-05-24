import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

if (!process.env.DATABASE_URL) {
    throw new Error("DB URL is not specified");
}
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
