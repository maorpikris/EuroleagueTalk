import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { getGameAiPrediction } from '../services/api';
import Typewriter from './Typewriter';

interface AiPredictionData {
    prediction: string;
    homeTeamFocus: string[];
    awayTeamFocus: string[];
}

interface AiPredictionProps {
    seasonCode: string;
    gameCode: string;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamImage: string;
    awayTeamImage: string;
}

const AiPrediction: React.FC<AiPredictionProps> = ({
    seasonCode,
    gameCode,
    homeTeamName,
    awayTeamName,
    homeTeamImage,
    awayTeamImage
}) => {
    const [data, setData] = useState<AiPredictionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchedRef = React.useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;

        const fetchAiData = async () => {
            fetchedRef.current = true;
            try {
                const result = await getGameAiPrediction(seasonCode, gameCode);
                setData(result);
            } catch (err: any) {
                console.error('Failed to fetch AI prediction:', err);
                setError('Could not load AI insights.');
            } finally {
                setLoading(false);
            }
        };

        fetchAiData();
    }, [seasonCode, gameCode]);

    if (loading) {
        return (
            <Paper elevation={0} sx={{
                p: 4,
                mb: 6,
                borderRadius: 6,
                border: '1px solid rgba(139, 92, 246, 0.1)',
                background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'pulse 2s infinite ease-in-out',
                '@keyframes pulse': {
                    '0%': { opacity: 0.8 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.8 }
                }
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.03)',
                    filter: 'blur(40px)',
                    animation: 'float 4s infinite ease-in-out',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translate(0, 0)' },
                        '50%': { transform: 'translate(-10px, 10px)' }
                    }
                }} />

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <Box sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #8b5cf6, #d946ef)',
                        animation: 'spin 2s linear infinite',
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)', filter: 'hue-rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)', filter: 'hue-rotate(360deg)' }
                        }
                    }} />
                    <Typography variant="overline" sx={{ fontWeight: 800, color: '#8b5cf6', letterSpacing: 1.5 }}>
                        AI is analyzing the court...
                    </Typography>
                </Stack>

                <Box sx={{ mb: 3 }}>
                    <Box sx={{
                        height: 24,
                        width: '80%',
                        bgcolor: 'rgba(0,0,0,0.04)',
                        borderRadius: 1,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                            animation: 'shimmer 1.5s infinite',
                            '@keyframes shimmer': {
                                '0%': { transform: 'translateX(-100%)' },
                                '100%': { transform: 'translateX(100%)' }
                            }
                        }
                    }} />
                </Box>

                <Divider sx={{ my: 3, opacity: 0.3 }} />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: 16, width: '40%', bgcolor: 'rgba(0,0,0,0.04)', mb: 2, borderRadius: 1 }} />
                        <Stack spacing={1.5}>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ height: 12, width: '90%', bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }} />
                            ))}
                        </Stack>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: 16, width: '40%', bgcolor: 'rgba(0,0,0,0.04)', mb: 2, borderRadius: 1 }} />
                        <Stack spacing={1.5}>
                            {[1, 2, 3].map((i) => (
                                <Box key={i} sx={{ height: 12, width: '90%', bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }} />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        );
    }

    if (error || !data) {
        return null;
    }

    return (
        <Paper elevation={0} sx={{
            p: 4,
            mb: 6,
            borderRadius: 6,
            border: '1px solid rgba(139, 92, 246, 0.2)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.05)',
                filter: 'blur(40px)'
            }} />

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Sparkles size={20} color="#8b5cf6" />
                <Typography variant="overline" sx={{ fontWeight: 800, color: '#8b5cf6', letterSpacing: 1.5 }}>
                    AI Match Preview
                </Typography>
            </Stack>

            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, lineHeight: 1.4, minHeight: '3em' }}>
                <Typewriter text={data.prediction} />
            </Typography>

            <Divider sx={{ my: 3, opacity: 0.5 }} />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <img src={homeTeamImage} alt={homeTeamName} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                            {homeTeamName} Focus
                        </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                        {data.homeTeamFocus.map((point, idx) => (
                            <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                                <Box sx={{
                                    mt: 0.5,
                                    minWidth: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#8b5cf6'
                                }} />
                                <Typography variant="body2" color="text.secondary">
                                    <Typewriter text={point} delay={(idx * 300)} />
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                        <img src={awayTeamImage} alt={awayTeamName} style={{ width: 24, height: 24, objectFit: 'contain' }} />
                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                            {awayTeamName} Focus
                        </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                        {data.awayTeamFocus.map((point, idx) => (
                            <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                                <Box sx={{
                                    mt: 0.5,
                                    minWidth: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#f59e0b'
                                }} />
                                <Typography variant="body2" color="text.secondary">
                                    <Typewriter text={point} delay={(idx * 300)} />
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
};

export default AiPrediction;
