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

import {
  ILogger,
  ICryptoHelper,
  IUserRepository,
  IAuthService,
  IUserService,
  IAuthController,
  IUserController,
  IAuthMiddleware
} from '../types/service-types';

// Create and configure the container
export const container = new Container();

// Bind all services with proper typing
container.bind<ILogger>(TYPES.Logger).toDynamicValue(() => createLogger());

container.bind<ICryptoHelper>(TYPES.CryptoHelper).toDynamicValue(() => createCryptoHelper());

container.bind<IUserRepository>(TYPES.UserRepository).toDynamicValue(() => {
  const logger = container.get<ILogger>(TYPES.Logger);
  return createUserRepository(logger);
});

container.bind<IAuthService>(TYPES.AuthService).toDynamicValue(() => {
  const userRepo = container.get<IUserRepository>(TYPES.UserRepository);
  const crypto = container.get<ICryptoHelper>(TYPES.CryptoHelper);
  const logger = container.get<ILogger>(TYPES.Logger);
  return createAuthService(userRepo, crypto, logger);
});

container.bind<IUserService>(TYPES.UserService).toDynamicValue(() => {
  const userRepo = container.get<IUserRepository>(TYPES.UserRepository);
  const logger = container.get<ILogger>(TYPES.Logger);
  return createUserService(userRepo, logger);
});

container.bind<IAuthController>(TYPES.AuthController).toDynamicValue(() => {
  const authService = container.get<IAuthService>(TYPES.AuthService);
  const logger = container.get<ILogger>(TYPES.Logger);
  return createAuthController(authService, logger);
});

container.bind<IUserController>(TYPES.UserController).toDynamicValue(() => {
  const userService = container.get<IUserService>(TYPES.UserService);
  const logger = container.get<ILogger>(TYPES.Logger);
  return createUserController(userService, logger);
});

container.bind<IAuthMiddleware>(TYPES.AuthMiddleware).toDynamicValue(() => {
  const userRepo = container.get<IUserRepository>(TYPES.UserRepository);
  const logger = container.get<ILogger>(TYPES.Logger);
  return createAuthMiddleware(userRepo, logger);
});

export default container;