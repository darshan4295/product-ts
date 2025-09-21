import express from 'express';
import { container } from '../container';
import { TYPES, IAuthMiddleware } from '../types/service-types';

// Get the auth middleware from the DI container
const authMiddleware = container.get<IAuthMiddleware>(TYPES.AuthMiddleware);

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response> => {
    return authMiddleware.isOwner(req, res, next);
};

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void | express.Response> => {
    return authMiddleware.isAuthenticated(req, res, next);
};