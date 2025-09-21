import mongoose from "mongoose";
import { Document, Types } from 'mongoose';
import { IUser } from "../types";

const UserSchema = new mongoose.Schema({
    // Remove this line: _id: Types.ObjectId,  // MongoDB auto-generates _id
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id); // Fixed: was getUserBySessionToken
export const createUser = (values: Partial<IUser>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, username: string) => {
    return UserModel.findByIdAndUpdate(id, { username }, { new: true });
};