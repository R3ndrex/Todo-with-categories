import { Router } from "express";
import todosRouter from "./todosRouter";
import categoryRouter from "./categoryRouter";

const indexRouter: Router = Router();

indexRouter.use("/categories", categoryRouter);
indexRouter.use("/todos", todosRouter);

export default indexRouter;
