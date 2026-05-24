import { Router } from "express";
import todosController from "../controllers/todosController.js";
import { validate } from "../middleware/handleValidatorResult.js";
import {
    createTodoSchema,
    paramsTodoSchema,
} from "../validators/todosValidator.js";

const taskRouter: Router = Router();

taskRouter
    .route("/")
    .get(todosController.getAll)
    .post(validate(createTodoSchema), todosController.create);

taskRouter
    .route("/:id")
    .patch(validate(paramsTodoSchema), todosController.updateStatus)
    .delete(validate(paramsTodoSchema), todosController.delete);

export default taskRouter;
