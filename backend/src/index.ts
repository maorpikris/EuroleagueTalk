import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import euroleagueRoutes from './routes/euroleague.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import socialRoutes from './routes/social.routes';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EuroleagueTalk API',
            version: '1.0.0',
            description: 'API documentation for EuroleagueTalk application',
            contact: {
                name: 'Maor Pikris',
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                },
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/euroleague_talk';
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', euroleagueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/', (req: Request, res: Response) => {
    res.send('EuroleagueTalk API is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
