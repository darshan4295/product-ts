import express from 'express';

import { deleteUser, getAllUsers, updateUser } from '../controllers/user';

import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router)=>{
    router.get('/user/users',isAuthenticated, getAllUsers);
    router.delete('/user/:id', isAuthenticated, isOwner, deleteUser);
    router.put('/user/:id', updateUser)
}