import { Request, Response, NextFunction } from "express";
import log from "../../logger";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _: NextFunction,
) => {
  // Default error status code
  let statusCode = 500;

  // Default error message
  let errorMessage = "Internal Server Error";

  // Check if the error has a status code and a message
  if (err.status && err.message) {
    statusCode = err.status;
    errorMessage = err.message;
  }
  
  // Log the error for debugging purposes (you can customize this part)
  log.error(err.message);
  log.trace(err);

  if (process.env.NODE_ENV === "development") {
    // If the environment is development, return the error stack as well
    return res.status(statusCode).json({
      error: errorMessage,
      debugMessage: err.debugMessage,
      stack: err.stack,
    });
  }

  // Send an error response to the client
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
