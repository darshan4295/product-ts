import { NextFunction, Request, Response } from "express";

const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
  next();
};

export default ErrorHandler;