import { prisma } from "../lib/prisma.js";

class TodosService {
    async getAll() {
        return await prisma.todo.findMany({});
    }
    async create(name: string, categoryId: string) {
        return await prisma.todo.create({
            data: {
                name,
                categoryId,
            },
        });
    }
    async updateStatus(id: string) {
        const todo = await prisma.todo.findUnique({ where: { id } });
        return await prisma.todo.update({
            where: {
                id,
            },
            data: {
                status: todo?.status === "UNDONE" ? "DONE" : "UNDONE",
            },
        });
    }
    async delete(id: string) {
        return await prisma.todo.delete({
            where: {
                id,
            },
        });
    }
}
export default new TodosService();
