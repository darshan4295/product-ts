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

export interface ILog extends Document {
  level: string;
  message: string;
  timestamp: Date;
}
// Extend Express Request interface to include identity
declare global {
  namespace Express {
    interface Request {
      identity?: IUser;
    }
  }
}

// Export service types - Make sure the file exists
export * from './service-types';
