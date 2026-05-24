import { Router } from "express";
import todosController from "../controllers/todosController.js";

const taskRouter: Router = Router();

taskRouter.get("/", todosController.getAll);
taskRouter.patch("/:id", todosController.updateStatus);
taskRouter.delete("/:id", todosController.delete);
taskRouter.post("/", todosController.create);

export default taskRouter;
