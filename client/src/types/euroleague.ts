export interface ImageSource {
    crest: string;
}

export interface Club {
    code: string;
    name: string;
    abbreviatedName: string;
    tvCode: string;
    images: ImageSource;
}

export interface Round {
    seasonCode: string;
    phaseTypeCode: string;
    round: number;
    index: number;
    name: string;
    minGameStartDate: string;
    maxGameStartDate: string;
    datesFormmated: string;
}

export interface Season {
    name: string;
    code: string;
    alias: string;
    year: number;
}

export interface GameTeam {
    code: string;
    name: string;
    abbreviatedName: string;
    score: number | null;
    imageUrls: {
        crest: string;
    };
}

export interface Game {
    id: string;
    code: number;
    date: string;
    status: string;
    home: GameTeam;
    away: GameTeam;
    round: {
        round: number;
        name: string;
    };
    venue: {
        name: string;
    };
}

export interface ApiResponse<T> {
    data: T;
    metadata?: any;
}
