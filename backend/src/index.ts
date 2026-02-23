import express, { Request, Response } from 'express';
import cors from 'cors';
import euroleagueRoutes from './routes/euroleague.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', euroleagueRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('EuroleagueTalk API is running!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
