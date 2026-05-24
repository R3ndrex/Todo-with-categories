export default class ApiError extends Error {
    public readonly status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
    static isApiError(error: Error): error is ApiError {
        if (error instanceof ApiError) {
            return true;
        }
        return false;
    }
    static NotFound(message?: string) {
        return new ApiError(message || "Not Found", 404);
    }
    static BadRequest() {
        return new ApiError("Bad Request", 404);
    }
    static InternalServer() {
        return new ApiError("Internal Server Error", 500);
    }
    static Unauthorized() {
        return new ApiError("Unauthorized Access", 401);
    }
}
