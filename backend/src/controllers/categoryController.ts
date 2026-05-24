import type { Request, Response } from "express";
import categoryService from "../services/categoryService.js";

class CategoryController {
    async getAll(req: Request, res: Response) {
        const categories = await categoryService.getAll();
        res.json({ data: categories });
    }
}
export default new CategoryController();
