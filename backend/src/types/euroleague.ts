export interface ImageSource {
    crest: string;
    onDarkCrest?: string | null;
    onLightCrest?: string | null;
}

export interface Club {
    code: string;
    name: string;
    abbreviatedName: string;
    tvCode: string;
    isVirtual: boolean;
    images: ImageSource;
    editorialName: string;
    sponsor: string;
    clubPermanentName: string;
    clubPermanentAlias: string;
    country: {
        code: string;
        name: string;
    };
    address: string;
    website: string;
    ticketsUrl: string;
    twitterAccount: string;
    venueCode: string;
    city: string;
    president: string;
    phone: string;
    primaryColor: string;
    secondaryColor: string;
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
    competitionCode: string;
    year: number;
    startDate: string;
    activationDate: string;
    endDate: string;
    winner?: Club | null;
}

export interface Game {
    gameCode: number;
    seasonCode: string;
    phaseTypeCode: string;
    roundNumber: number;
    gameStartDate: string;
    home: {
        code: string;
        name: string;
        score: number | null;
    };
    away: {
        code: string;
        name: string;
        score: number | null;
    };
    status: string;
}

export interface ApiResponse<T> {
    data: T;
    status?: string;
    metadata?: any;
}
