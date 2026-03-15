import { GoogleGenerativeAI } from '@google/generative-ai';
import { Game } from '../types/euroleague';

export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    }

    async getMatchInsights(game: Game) {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY is not set');
            throw new Error('AI service is currently unavailable.');
        }

        const prompt = `
            You are a Euroleague basketball expert. Analyze the following match-up:
            Home Team: ${game.home.name}
            Away Team: ${game.away.name}
            Provide:
            1. A short prediction (1-2 sentences) for the match.
            2. Three key focus points for ${game.home.name} to win.
            3. Three key focus points for ${game.away.name} to win.
            4. A predicted final score: provide exactly two integers, one for ${game.home.name} and one for ${game.away.name}.
            
            Format your response as a JSON object:
            {
                "prediction": "string",
                "homeScore": number,
                "awayScore": number,
                "homeTeamFocus": ["string", "string", "string"],
                "awayTeamFocus": ["string", "string", "string"]
            }
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(text);
        } catch (error) {
            console.error('Error generating AI content:', error);
            throw new Error('Failed to generate AI insights');
        }
    }
}
