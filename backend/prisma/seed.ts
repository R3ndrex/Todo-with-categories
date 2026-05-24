import "dotenv/config";
import { Status } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma.js";

async function main() {
    await prisma.todo.deleteMany();
    await prisma.category.deleteMany();

    await prisma.category.createMany({
        data: [{ name: "Work" }, { name: "Home" }, { name: "Shopping" }],
    });

    const categories = await prisma.category.findMany();
    const categoryByName = new Map(
        categories.map((category) => [category.name, category.id]),
    );
    const getCategoryId = (name: string) => {
        const categoryId = categoryByName.get(name);
        if (!categoryId) {
            throw new Error(`Seed category not found: ${name}`);
        }

        return categoryId;
    };

    await prisma.todo.createMany({
        data: [
            {
                name: "Prepare weekly report",
                status: Status.UNDONE,
                categoryId: getCategoryId("Work"),
            },
            {
                name: "Review project backlog",
                status: Status.DONE,
                categoryId: getCategoryId("Work"),
            },
            {
                name: "Clean kitchen",
                status: Status.UNDONE,
                categoryId: getCategoryId("Home"),
            },
            {
                name: "Pay electricity bill",
                status: Status.DONE,
                categoryId: getCategoryId("Home"),
            },
            {
                name: "Buy milk",
                status: Status.UNDONE,
                categoryId: getCategoryId("Shopping"),
            },
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Database seeded successfully.");
    })
    .catch(async (error: unknown) => {
        console.error("Database seed failed:", error);
        await prisma.$disconnect();
        process.exit(1);
    });
