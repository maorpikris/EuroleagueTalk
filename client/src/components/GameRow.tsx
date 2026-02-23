import React from 'react';
import type { Game } from '../types/euroleague';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, Stack, Typography, Box, Avatar, Button } from '@mui/material';
import { ChevronRight } from 'lucide-react';

interface Props {
    game: Game;
}

const GameRow: React.FC<Props> = ({ game }) => {
    const navigate = useNavigate();
    const isFinished = game.status === 'result';
    const startTime = new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const homeWinner = isFinished && (game.home.score || 0) > (game.away.score || 0);
    const awayWinner = isFinished && (game.away.score || 0) > (game.home.score || 0);

    return (
        <Card sx={{ mb: 2 }}>
            <CardActionArea onClick={() => navigate(`/game/${game.code}`)} sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={4}>
                    <Box sx={{ width: 200 }}>
                        <Typography variant="h6" fontWeight={800}>{startTime}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                            {game.venue.name}
                        </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={4} sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end" sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={700}>{game.home.name}</Typography>
                            <Avatar src={game.home.imageUrls.crest} alt={game.home.name} sx={{ width: 40, height: 40 }} />
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                            {isFinished ? (
                                <>
                                    <Box sx={{
                                        width: 50, height: 50, bgcolor: homeWinner ? 'secondary.main' : '#f0f0f0',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 2, fontSize: '1.5rem', fontWeight: 800
                                    }}>
                                        {game.home.score}
                                    </Box>
                                    <Box sx={{
                                        width: 50, height: 50, bgcolor: awayWinner ? 'secondary.main' : '#f0f0f0',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 2, fontSize: '1.5rem', fontWeight: 800
                                    }}>
                                        {game.away.score}
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="h6" fontWeight={800} color="text.secondary">VS</Typography>
                            )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                            <Avatar src={game.away.imageUrls.crest} alt={game.away.name} sx={{ width: 40, height: 40 }} />
                            <Typography variant="body1" fontWeight={700}>{game.away.name}</Typography>
                        </Stack>
                    </Stack>

                    <Box sx={{ width: 120, display: 'flex', justifyContent: 'flex-end' }}>
                        {isFinished ? (
                            <Button variant="outlined" size="small" sx={{ borderRadius: 10 }}>Overview</Button>
                        ) : (
                            <ChevronRight color="#666666" size={20} />
                        )}
                    </Box>
                </Stack>
            </CardActionArea>
        </Card>
    );
};

export default GameRow;
