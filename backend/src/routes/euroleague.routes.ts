import { Router } from 'express';
import { EuroleagueController } from '../controllers/euroleague.controller';

const router = Router();
const euroleagueController = new EuroleagueController();

/**
 * @swagger
 * tags:
 *   name: Euroleague
 *   description: Euroleague data retrieval
 */

/**
 * @swagger
 * /api/seasons:
 *   get:
 *     summary: Get all seasons
 *     tags: [Euroleague]
 *     responses:
 *       200:
 *         description: List of seasons
 */
router.get('/seasons', euroleagueController.getSeasons);

/**
 * @swagger
 * /api/seasons/{seasonCode}/games:
 *   get:
 *     summary: Get games for a season
 *     tags: [Euroleague]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of games
 */
router.get('/seasons/:seasonCode/games', euroleagueController.getGames);

/**
 * @swagger
 * /api/seasons/{seasonCode}/games/{gameCode}:
 *   get:
 *     summary: Get a specific game
 *     tags: [Euroleague]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game details
 */
router.get('/seasons/:seasonCode/games/:gameCode', euroleagueController.getGameByCode);

/**
 * @swagger
 * /api/seasons/{seasonCode}/rounds:
 *   get:
 *     summary: Get rounds for a season
 *     tags: [Euroleague]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of rounds
 */
router.get('/seasons/:seasonCode/rounds', euroleagueController.getRounds);

/**
 * @swagger
 * /api/seasons/{seasonCode}/clubs:
 *   get:
 *     summary: Get clubs for a season
 *     tags: [Euroleague]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of clubs
 */
router.get('/seasons/:seasonCode/clubs', euroleagueController.getClubs);

/**
 * @swagger
 * /api/seasons/{seasonCode}/games/{gameCode}/ai-prediction:
 *   get:
 *     summary: Get AI prediction for a game
 *     tags: [Euroleague]
 *     parameters:
 *       - in: path
 *         name: seasonCode
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: gameCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI prediction
 */
router.get('/seasons/:seasonCode/games/:gameCode/ai-prediction', euroleagueController.getGameAiPrediction);

export default router;
