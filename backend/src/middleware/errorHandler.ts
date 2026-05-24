import ApiError from "../error/ApiError.js";
import type { Request, Response, NextFunction } from "express";
export default function ErrorHandler(
    error: Error,
    _: Request,
    res: Response,
    next: NextFunction,
) {
    if (ApiError.isApiError(error)) {
        return res.status(error.status).json({
            message: error.message,
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
    });
}
