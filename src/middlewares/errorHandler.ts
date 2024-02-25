import { Errback, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

function errorHandler(
  err: Errback,
  _: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      body: {
        message: "Error From Zod",
        error: err,
      },
    });
  }
  return res.status(500).json({
    statusCode: 500,
    body: {
      message: "Something Wrong with the server",
      error: err,
    },
  });
}

export default errorHandler;
