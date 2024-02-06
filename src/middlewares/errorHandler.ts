import { Errback, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

function errorHandler(
  err: Errback,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.log(err)
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Error From Zod",
      error: err,
    });
  }

  return res.status(500).json({
    message: "Something Wrong with the server",
    error: err,
  });
}

export default errorHandler;
