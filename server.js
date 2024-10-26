import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js'; 
import userRoutes from './routes/user.routes.js'; 
import taskRoutes from './routes/task.routes.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 


app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
