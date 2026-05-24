import "dotenv/config";
import { createClient } from "@libsql/client";

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL) {
    throw new Error("TURSO_DATABASE_URL is not specified");
}

if (!TURSO_AUTH_TOKEN) {
    throw new Error("TURSO_AUTH_TOKEN is not specified");
}

const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});

await db.batch([
    `CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "Todo" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'UNDONE',
        "categoryId" TEXT,
        CONSTRAINT "Todo_categoryId_fkey"
            FOREIGN KEY ("categoryId")
            REFERENCES "Category" ("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE
    )`,
    `INSERT INTO "Category" ("id", "name")
        SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' ||
               substr(hex(randomblob(2)), 2) || '-' ||
               substr('89ab', abs(random()) % 4 + 1, 1) ||
               substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
               'Work'
        WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name" = 'Work')`,
    `INSERT INTO "Category" ("id", "name")
        SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' ||
               substr(hex(randomblob(2)), 2) || '-' ||
               substr('89ab', abs(random()) % 4 + 1, 1) ||
               substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
               'Home'
        WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name" = 'Home')`,
    `INSERT INTO "Category" ("id", "name")
        SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' ||
               substr(hex(randomblob(2)), 2) || '-' ||
               substr('89ab', abs(random()) % 4 + 1, 1) ||
               substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))),
               'Shopping'
        WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name" = 'Shopping')`,
]);

const categories = await db.execute(`SELECT "id", "name" FROM "Category" ORDER BY "name"`);

console.log("Turso schema is ready.");
console.table(categories.rows);
