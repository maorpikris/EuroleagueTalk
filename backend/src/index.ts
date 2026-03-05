import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import euroleagueRoutes from './routes/euroleague.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import socialRoutes from './routes/social.routes';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/euroleague_talk';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', euroleagueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);

// Serve uploads folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req: Request, res: Response) => {
    res.send('EuroleagueTalk API is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
