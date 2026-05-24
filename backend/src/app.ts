import express from "express";
import ApiError from "./error/ApiError.js";
import ErrorHandler from "./middleware/errorHandler.js";
import type { Express } from "express";

const app: Express = express();

app.use((req, res) => {
    throw ApiError.NotFound();
});
app.use(ErrorHandler);

export default app;
