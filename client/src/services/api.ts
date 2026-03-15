import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

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

export const getGameDetails = async (seasonCode: string, gameCode: string) => {
    const response = await api.get(`/seasons/${seasonCode}/games/${gameCode}`);
    return response.data;
};

export const getGameAiPrediction = async (seasonCode: string, gameCode: string) => {
    const response = await api.get(`/seasons/${seasonCode}/games/${gameCode}/ai-prediction`);
    return response.data;
};

export const getClubs = async (seasonCode: string) => {
    const response = await api.get(`/seasons/${seasonCode}/clubs`);
    return response.data;
};

export const register = (data: any) => api.post('/auth/register', data).then(r => r.data);
export const login = (data: any) => api.post('/auth/login', data).then(r => r.data);
export const logout = (refreshToken: string) => api.post('/auth/logout', { refreshToken }).then(r => r.data);
export const googleAuth = (data: any) => api.post('/auth/google', data).then(r => r.data);

export const getProfile = () => api.get('/users/profile').then(r => r.data);
export const updateProfile = (formData: FormData) => api.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data);

export const createPost = (formData: FormData) => api.post('/social', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data);

export const getPostsByGame = (seasonCode: string, gameId: string, page: number = 1, limit: number = 10) =>
    api.get(`/social/game/${seasonCode}/${gameId}`, { params: { page, limit } }).then(r => r.data);

export const getPostsByUser = (userId: string, page: number = 1, limit: number = 10) =>
    api.get(`/social/user/${userId}`, { params: { page, limit } }).then(r => r.data);

export const updatePost = (postId: string, data: { text: string }) => api.put(`/social/${postId}`, data).then(r => r.data);
export const deletePost = (postId: string) => api.delete(`/social/${postId}`).then(r => r.data);
export const toggleLike = (postId: string) => api.post(`/social/${postId}/like`).then(r => r.data);

export const addComment = (data: { postId: string, text: string }) => api.post('/social/comments', data).then(r => r.data);
export const getCommentsByPost = (postId: string) => api.get(`/social/${postId}/comments`).then(r => r.data);
export const deleteComment = (commentId: string) => api.delete(`/social/comments/${commentId}`).then(r => r.data);

export default api;
