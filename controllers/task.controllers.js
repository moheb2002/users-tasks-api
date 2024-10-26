import Task from '../models/task.model.js'; 

export const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, owner: req.user._id });  
        await task.save();
        res.status(201).json(task);  
    } catch (e) {
        res.status(400).json({ error: e.message });  
    }
};


export const getTasks = async (req, res) => {
    try {
        await req.user.populate('tasks');
        res.status(200).json(req.user.tasks); 
    } catch (e) {
        res.status(500).json({ error: e.message });  
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        await task.populate('owner'); 
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },  
            req.body,
            { new: true, runValidators: true }  
        );
        if (!task) {
            return res.status(404).json({ error: 'No task found or unauthorized' });
        }
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).json({ error: 'No task found or unauthorized' });
        }
        res.status(200).json({ message: 'Task deleted successfully', task });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
