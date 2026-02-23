import { Request, Response } from 'express';
import { EuroleagueService } from '../services/euroleague.service';

const euroleagueService = new EuroleagueService();

export class EuroleagueController {
    async getGames(req: Request, res: Response) {
        try {
            const { seasonCode } = req.params;
            const { teamCode, phaseTypeCode, roundNumber } = req.query as { [key: string]: string };
            const games = await euroleagueService.getGames(
                seasonCode as string,
                teamCode,
                phaseTypeCode,
                roundNumber ? parseInt(roundNumber) : undefined
            );
            res.json(games);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRounds(req: Request, res: Response) {
        try {
            const { seasonCode } = req.params;
            const { phaseTypeCode } = req.query as { phaseTypeCode: string };
            const rounds = await euroleagueService.getRounds(seasonCode as string, phaseTypeCode);
            res.json(rounds);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSeasons(req: Request, res: Response) {
        try {
            const seasons = await euroleagueService.getSeasons();
            res.json(seasons);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getClubs(req: Request, res: Response) {
        try {
            const { seasonCode } = req.params;
            const clubs = await euroleagueService.getClubs(seasonCode as string);
            res.json(clubs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
