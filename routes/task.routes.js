import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controllers.js';
import auth from '../middlewares/auth.js';  

const router = express.Router();

router.post('/tasks', auth, createTask);     
router.get('/tasks', auth, getTasks);         
router.get('/tasks/:id', auth, getTaskById);  
router.patch('/tasks/:id', auth, updateTask);
router.delete('/tasks/:id', auth, deleteTask); 

export default router;
