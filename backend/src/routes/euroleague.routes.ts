import { Router } from 'express';
import { EuroleagueController } from '../controllers/euroleague.controller';

const router = Router();
const euroleagueController = new EuroleagueController();

router.get('/seasons', euroleagueController.getSeasons);
router.get('/seasons/:seasonCode/games', euroleagueController.getGames);
router.get('/seasons/:seasonCode/rounds', euroleagueController.getRounds);
router.get('/seasons/:seasonCode/clubs', euroleagueController.getClubs);

export default router;
