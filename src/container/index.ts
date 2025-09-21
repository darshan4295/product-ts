import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types/service-types';

import {
  createLogger,
  createCryptoHelper,
  createUserRepository,
  createAuthService,
  createUserService,
  createAuthController,
  createUserController,
  createAuthMiddleware
} from '../services';

// Create and configure the container
export const container = new Container();

// Bind all services
container.bind(TYPES.Logger).toDynamicValue(() => createLogger());

container.bind(TYPES.CryptoHelper).toDynamicValue(() => createCryptoHelper());

container.bind(TYPES.UserRepository).toDynamicValue((context) => {
  const logger = context.container.get(TYPES.Logger);
  return createUserRepository(logger);
});

container.bind(TYPES.AuthService).toDynamicValue((context) => {
  const userRepo = context.container.get(TYPES.UserRepository);
  const crypto = context.container.get(TYPES.CryptoHelper);
  const logger = context.container.get(TYPES.Logger);
  return createAuthService(userRepo, crypto, logger);
});

container.bind(TYPES.UserService).toDynamicValue((context) => {
  const userRepo = context.container.get(TYPES.UserRepository);
  const logger = context.container.get(TYPES.Logger);
  return createUserService(userRepo, logger);
});

container.bind(TYPES.AuthController).toDynamicValue((context) => {
  const authService = context.container.get(TYPES.AuthService);
  const logger = context.container.get(TYPES.Logger);
  return createAuthController(authService, logger);
});

container.bind(TYPES.UserController).toDynamicValue((context) => {
  const userService = context.container.get(TYPES.UserService);
  const logger = context.container.get(TYPES.Logger);
  return createUserController(userService, logger);
});

container.bind(TYPES.AuthMiddleware).toDynamicValue((context) => {
  const userRepo = context.container.get(TYPES.UserRepository);
  const logger = context.container.get(TYPES.Logger);
  return createAuthMiddleware(userRepo, logger);
});

export default container;