import { Router } from "express";
import categoryController from "../controllers/categoryController";
const categoryRouter: Router = Router();

categoryRouter.get("/", categoryController.getAll);
export default categoryRouter;
