import categoryService from "../services/categoryService";

class CategoryController {
    async getAll() {
        return await categoryService.getAll();
    }
}
export default new CategoryController();
