import ApiError from "../error/ApiError.js";
import todosService from "../services/todosService.js";
import type { Response, Request } from "express";
class TodosController {
    async getAll(req: Request, res: Response) {
        const todos = await todosService.getAll();
        return res.json({ data: todos });
    }
    async create(req: Request, res: Response) {
        const { name, categoryId } = req.body;
        if (name && categoryId) {
            const createdTodo = await todosService.create(name, categoryId);
            return res.status(201).json({ data: createdTodo });
        }
        throw ApiError.BadRequest();
    }
    async updateStatus(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (id) {
            const updatedTodo = await todosService.updateStatus(id);
            return res.status(201).json({ data: updatedTodo });
        }
        throw ApiError.BadRequest();
    }
    async delete(req: Request<{ id: string }>, res: Response) {
        const { id } = req.params;
        if (id) {
            const updatedTodo = await todosService.delete(id);
            return res.status(201).json({ data: updatedTodo });
        }
    }
}
export default new TodosController();
