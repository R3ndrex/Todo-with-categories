import express from "express";
import ApiError from "./error/ApiError.js";
import ErrorHandler from "./middleware/errorHandler.js";
import type { Express } from "express";
import indexRouter from "./routes/indexRoute.js";

const app: Express = express();

app.use(express.json());
app.use("/api", indexRouter);
app.use((req, res) => {
    throw ApiError.NotFound();
});
app.use(ErrorHandler);

export default app;
