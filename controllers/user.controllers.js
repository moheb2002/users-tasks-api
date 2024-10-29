import User from '../models/user.model.js'; 

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateToken();
        res.status(201).json({ user, token });
    } catch (e) {
        if (e.name === 'ValidationError') {
            return res.status(400).json({ error: e.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const updateUserById = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};


export const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted', user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);  
        const token = await user.generateToken();  
        res.status(200).json({ user, token });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};


export const getProfile = (req, res) => {
    res.status(200).json(req.user);  
};

export const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token !== req.token);  
        await req.user.save();
        res.status(200).json({ message: 'Logged out from current session' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

export const logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];  
        await req.user.save();
        res.status(200).json({ message: 'Logged out from all sessions' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
