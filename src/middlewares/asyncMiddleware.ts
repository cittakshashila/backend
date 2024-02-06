import { NextFunction, Request, Response } from "express";

function asyncMiddleware(handler: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

export default asyncMiddleware;
