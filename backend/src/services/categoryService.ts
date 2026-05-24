import { prisma } from "../lib/prisma";

class CategoryService {
    async getAll() {
        return await prisma.todo.findMany({});
    }
}
export default new CategoryService();
