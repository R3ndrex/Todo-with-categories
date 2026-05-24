import { prisma } from "../lib/prisma";

class CategoryService {
    async getAll() {
        return await prisma.category.findMany({});
    }
}
export default new CategoryService();
