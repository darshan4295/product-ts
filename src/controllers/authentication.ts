import express from 'express';
import { createUser, getUserByEmail } from '../db/user';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        
        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash.toString()) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, (user._id as string).toString()).toString();
        await user.save();
        
        res.cookie('Rest-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req: express.Request, res: express.Response): Promise<express.Response> => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = random();
        await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password).toString()
            }
        });

        return res.status(200).json({ message: "Registration Successful" });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
