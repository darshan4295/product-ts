import mongoose from "mongoose";
import { ILog } from "../types";

const logSchema = new mongoose.Schema({
  level: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, expires:30000 }
});

export const Log = mongoose.model<ILog>("Log", logSchema);

export const createLogEntry = async (level: string, message: string) => {
    const logEntry = new Log({ level, message });
    console.log(`Creating log entry: ${level} - ${message}`);

    return (await logEntry.save()).toObject();
};