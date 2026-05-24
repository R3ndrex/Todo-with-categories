import express from "express";
import ApiError from "./error/ApiError.js";
import ErrorHandler from "./middleware/errorHandler.js";
import type { Express } from "express";
import indexRouter from "./routes/indexRoute.js";

const app: Express = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    const hasOriginAllowlist = allowedOrigins && allowedOrigins.length > 0;

    if (!hasOriginAllowlist) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    next();
});
app.use(express.json());
app.use("/api", indexRouter);
app.use((req, res) => {
    throw ApiError.NotFound();
});
app.use(ErrorHandler);

export default app;
