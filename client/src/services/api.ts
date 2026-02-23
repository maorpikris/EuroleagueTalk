import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const getSeasons = async () => {
    const response = await api.get('/seasons');
    return response.data;
};

export const getRounds = async (seasonCode: string, phaseTypeCode: string = 'RS') => {
    const response = await api.get(`/seasons/${seasonCode}/rounds`, { params: { phaseTypeCode } });
    return response.data;
};

export const getGames = async (seasonCode: string, roundNumber: number, phaseTypeCode: string = 'RS') => {
    const response = await api.get(`/seasons/${seasonCode}/games`, {
        params: { roundNumber, phaseTypeCode }
    });
    return response.data;
};

export const getClubs = async (seasonCode: string) => {
    const response = await api.get(`/seasons/${seasonCode}/clubs`);
    return response.data;
};

export default api;
