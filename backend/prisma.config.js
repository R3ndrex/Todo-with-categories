import "dotenv/config";
import { defineConfig } from "prisma/config";
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error("DB URL is not specified");
}
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: DATABASE_URL,
    },
});
//# sourceMappingURL=prisma.config.js.map