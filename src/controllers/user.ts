import express from 'express';

import { deleteUserById, getUsers, updateUserById } from '../db/user';



export const getAllUsers = async (req: express.Request, res: express.Response, next: express.NextFunction)=>{
    try{

        const users = await getUsers();
          return res.status(200).json(users).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const deleteUser =  async (req: express.Request, res: express.Response)=>{
    try{
        const {id} = req.params;
        const users = await deleteUserById(id);
        
        return res.status(200).json(deleteUser).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const updateUser = async(req: express.Request, res: express.Response)=>{
        try{
        const {id} = req.params;
        const {username} = req.body
        const users = await updateUserById(id, username);
        
        return res.status(200).json(users).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }

}