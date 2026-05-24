import "dotenv/config";
import { defineConfig } from "prisma/config";

const LOCAL_DATABASE_URL = process.env.LOCAL_DATABASE_URL ?? "file:./dev.db";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: LOCAL_DATABASE_URL,
    },
});
