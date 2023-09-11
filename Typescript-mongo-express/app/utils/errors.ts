//One place to Contain and handel all errors

class ApiError extends Error {
    public debugMessage?: string;
    public status?: number;
    constructor({
      message,
      debugMessage,
      status,
    }: {
      message: string;
      debugMessage?: string;
      status?: number;
    }) {
      super(message);
      this.debugMessage = debugMessage;
      this.status = status;
    }
  
    public static BadRequestError({
      debugMessage,
      message,
    }: {
      debugMessage?: string;
      message?: string;
    }) {
      return new ApiError({
        message: message || "Bad Request",
        debugMessage,
        status: 400,
      });
    }
  
    public static InternalServerError({
      debugMessage,
      message,
    }: {
      debugMessage?: string;
      message?: string;
    }) {
      return new ApiError({
        message: message || "Internal Server Error",
        debugMessage,
        status: 500,
      });
    }
  
    public static NotFoundError({
      debugMessage,
      message,
    }: {
      debugMessage?: string;
      message?: string;
    }) {
      return new ApiError({
        message: message || "Not Found",
        debugMessage,
        status: 404,
      });
    }
  
    public static UnauthorizedError({
      debugMessage,
      message,
    }: {
      debugMessage?: string;
      message?: string;
    }) {
      return new ApiError({
        message: message || "Unauthorized",
        debugMessage,
        status: 401,
      });
    }
  }
  
  export default ApiError;