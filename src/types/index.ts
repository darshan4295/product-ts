import { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken?: string;
  };
}

// Extend Express Request interface to include identity
declare global {
  namespace Express {
    interface Request {
      identity?: IUser;
    }
  }
}

// Export service types
export * from './service-types';