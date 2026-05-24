import { Router } from "express";
import todosRouter from "./todosRouter.js";
import categoryRouter from "./categoryRouter.js";

const indexRouter: Router = Router();

indexRouter.use("/categories", categoryRouter);
indexRouter.use("/todos", todosRouter);

export default indexRouter;
