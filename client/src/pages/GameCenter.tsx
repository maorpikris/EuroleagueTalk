import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSeasons, getRounds, getGames } from '../services/api';
import type { Season, Round, Game } from '../types/euroleague';
import SeasonSelector from '../components/SeasonSelector';
import RoundSelector from '../components/RoundSelector';
import GameRow from '../components/GameRow';
import { Container, Box, Typography, Stack, Button, CircularProgress } from '@mui/material';

const GameCenter: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [games, setGames] = useState<Game[]>([]);

    const selectedSeason = searchParams.get('season') || '';
    const selectedRound = parseInt(searchParams.get('round') || '0');
    const selectedPhase = searchParams.get('phase') || 'RS';

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const init = async () => {
            try {
                const seasonsData = await getSeasons();
                setSeasons(seasonsData.data);
                if (seasonsData.data.length > 0 && !searchParams.get('season')) {
                    updateUrlParams({ season: seasonsData.data[0].code });
                }
            } catch (error) {
                console.error('Failed to fetch seasons:', error);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (selectedSeason) {
            const fetchRounds = async () => {
                try {
                    const roundsData = await getRounds(selectedSeason, selectedPhase);
                    setRounds(roundsData.data);
                    // Default to the highest round if no round is in URL
                    if (roundsData.data.length > 0 && !searchParams.get('round')) {
                        const maxRound = Math.max(...roundsData.data.map((r: Round) => r.round));
                        updateUrlParams({ round: maxRound.toString() });
                    }
                } catch (error) {
                    console.error('Failed to fetch rounds:', error);
                }
            };
            fetchRounds();
        }
    }, [selectedSeason, selectedPhase]);

    useEffect(() => {
        if (selectedSeason && selectedRound) {
            const fetchGames = async () => {
                setLoading(true);
                try {
                    const gamesData = await getGames(selectedSeason, selectedRound, selectedPhase);
                    setGames(gamesData.data);
                } catch (error) {
                    console.error('Failed to fetch games:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchGames();
        }
    }, [selectedSeason, selectedRound, selectedPhase]);

    // Group games by date
    const groupedGames = games.reduce((acc: { [key: string]: Game[] }, game) => {
        const date = new Date(game.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(game);
        return acc;
    }, {});

    const updateUrlParams = (params: Record<string, string>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    newParams.set(key, value);
                } else {
                    newParams.delete(key);
                }
            });
            return newParams;
        });
    };

    const handleSeasonChange = (code: string) => {
        updateUrlParams({ season: code, round: '', phase: 'RS' });
    };

    const handleRoundChange = (round: number) => {
        updateUrlParams({ round: round.toString() });
    };

    const handlePhaseChange = (phase: string) => {
        updateUrlParams({ phase, round: '' });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box component="header" sx={{ mb: 6 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={3}>
                    <Typography variant="h1" sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                        Game Center
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <Box sx={{ bgcolor: 'white', p: 0.5, borderRadius: 3, border: '1px solid #e0e0e0', display: 'flex' }}>
                            {['RS', 'PO', 'FF'].map((p) => (
                                <Button
                                    key={p}
                                    variant={selectedPhase === p ? 'contained' : 'text'}
                                    onClick={() => handlePhaseChange(p)}
                                    size="small"
                                    sx={{
                                        px: 2,
                                        borderRadius: 2,
                                        boxShadow: 'none',
                                        '&:hover': { boxShadow: 'none' }
                                    }}
                                >
                                    {p === 'RS' ? 'Regular Season' : p === 'PO' ? 'Playoffs' : 'Final Four'}
                                </Button>
                            ))}
                        </Box>
                        <SeasonSelector
                            seasons={seasons}
                            selectedSeasonCode={selectedSeason}
                            onSeasonChange={handleSeasonChange}
                        />
                    </Stack>
                </Stack>
            </Box>

            <RoundSelector
                rounds={rounds}
                selectedRound={selectedRound}
                onRoundChange={handleRoundChange}
            />

            <Box component="main">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    Object.entries(groupedGames).length > 0 ? (
                        Object.entries(groupedGames).map(([date, dateGames]) => (
                            <Box key={date} sx={{ mb: 6 }}>
                                <Typography variant="h2" sx={{ mb: 3, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {date}
                                    <Box component="span" sx={{ fontSize: '0.9rem', fontWeight: 500, bgcolor: '#f0f0f0', px: 1, borderRadius: 1 }}>
                                        {dateGames.length} games
                                    </Box>
                                </Typography>
                                <Box>
                                    {dateGames.map((game) => (
                                        <GameRow key={game.id} game={game} />
                                    ))}
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 3, border: '1px solid #e0e0e0' }}>
                            <Typography variant="h6" color="text.secondary">No games found for this period.</Typography>
                        </Box>
                    )
                )}
            </Box>
        </Container>
    );
};

export default GameCenter;
