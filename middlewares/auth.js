import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; 

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;  
        req.user = user;    
        next();
    } catch (e) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export default auth; 
