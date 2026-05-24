import ApiError from "../error/ApiError.js";
import type { Request, Response, NextFunction } from "express";
export default function ErrorHandler(
    error: Error,
    _: Request,
    res: Response,
    next: NextFunction,
) {
    if (ApiError.isApiError(error)) {
        return res.render("pages/error", {
            message: error.message,
            status: error.status,
        });
    }
    return res.render("pages/error", {
        message: "Internal Server Error",
        status: 500,
    });
}
