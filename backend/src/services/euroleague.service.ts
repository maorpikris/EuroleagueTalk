import axios from 'axios';
import { Game, Round, Season, Club, ApiResponse } from '../types/euroleague';

const BASE_URL = 'https://feeds.incrowdsports.com/provider/euroleague-feeds/v2';

export class EuroleagueService {
    async getGames(seasonCode: string, teamCode: string = '', phaseTypeCode: string = 'RS', roundNumber?: number): Promise<ApiResponse<Game[]>> {
        const params = { teamCode, phaseTypeCode, roundNumber };
        const response = await axios.get(`${BASE_URL}/competitions/E/seasons/${seasonCode}/games`, { params });
        return response.data;
    }

    async getRounds(seasonCode: string, phaseTypeCode: string = 'RS'): Promise<ApiResponse<Round[]>> {
        const params = { phaseTypeCode };
        const response = await axios.get(`${BASE_URL}/competitions/E/seasons/${seasonCode}/rounds`, { params });
        return response.data;
    }

    async getSeasons(): Promise<ApiResponse<Season[]>> {
        const response = await axios.get(`${BASE_URL}/competitions/E/seasons`);
        return response.data;
    }

    async getClubs(seasonCode: string): Promise<ApiResponse<Club[]>> {
        const response = await axios.get(`${BASE_URL}/competitions/E/seasons/${seasonCode}/clubs`);
        return response.data;
    }
}
