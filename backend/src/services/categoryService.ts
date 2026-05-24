import ApiError from "../error/ApiError.js";
import { prisma } from "../lib/prisma.js";

const MAX_TODOS_PER_CATEGORY = 5;
class CategoryService {
    async getAll() {
        return await prisma.category.findMany({});
    }
    async checkAmount(categoryId: string) {
        const todosInCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                tasks: true,
            },
        });
        if (!todosInCategory) {
            throw ApiError.BadRequest();
        }
        return MAX_TODOS_PER_CATEGORY >= todosInCategory?.tasks.length;
    }
}
export default new CategoryService();
