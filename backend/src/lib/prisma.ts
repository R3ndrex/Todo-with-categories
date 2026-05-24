import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseUrl = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!databaseUrl) {
    throw new Error("TURSO_DATABASE_URL is not specified");
}

if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN is not specified");
}

const adapter = new PrismaLibSql({
    url: databaseUrl,
    authToken,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
