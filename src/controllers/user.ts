import express from 'express';
import { container } from '../container';
import { TYPES, IUserController } from '../types/service-types';
import { ILog, ITransactionLogger } from '../types';

const userController = container.get<IUserController>(TYPES.UserController);
const tLogger = container.get<ITransactionLogger>(TYPES.TransactionMiddleware);

export const getAllUsers = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    tLogger.createTransactionLogger("info", "fetch call");
    return userController.getAllUsers(req, res, next);
};

export const deleteUser = (req: express.Request, res: express.Response) => {
    return userController.deleteUser(req, res);
};

export const updateUser = (req: express.Request, res: express.Response) => {
    return userController.updateUser(req, res);
};
