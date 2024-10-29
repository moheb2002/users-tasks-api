import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; 

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authorization token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

        if (!user) {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }

        req.token = token;  
        req.user = user;    
        next();
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export default auth;