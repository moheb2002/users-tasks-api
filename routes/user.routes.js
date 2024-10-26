import express from 'express';
import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUserById, 
    deleteUserById, 
    loginUser, 
    getProfile, 
    logout, 
    logoutAll 
} from '../controllers/user.controllers.js'; 

import auth from '../middlewares/auth.js'; 

const router = express.Router();


router.post('/users', createUser);          
router.post('/users/login', loginUser);     

// Protected routes (auth middleware required)
router.get('/users/me', auth, getProfile);         
router.post('/users/logout', auth, logout);      
router.post('/users/logoutAll', auth, logoutAll); 
router.patch('/users/:id', auth, updateUserById);  
router.delete('/users/:id', auth, deleteUserById); 

// Optional (admin route) - Get all users
// router.get('/users', auth, getAllUsers);  

export default router; 