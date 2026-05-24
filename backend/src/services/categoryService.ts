import { prisma } from "../lib/prisma.js";

class CategoryService {
    async getAll() {
        return await prisma.category.findMany({});
    }
}
export default new CategoryService();
