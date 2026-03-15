import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Stack, CircularProgress, Divider, Paper, Alert } from '@mui/material';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { getPostsByGame, getGameDetails } from '../services/api';
import type { Game } from '../types/euroleague';
import type { Post as PostType } from '../types/social';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import AiPrediction from '../components/AiPrediction';
import { useAuth } from '../contexts/AuthContext';

const GameDetails: React.FC = () => {
    const { seasonCode, gameId } = useParams<{ seasonCode: string, gameId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [posts, setPosts] = useState<PostType[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [game, setGame] = useState<Game | null>(null);
    const [loadingGame, setLoadingGame] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (gameId) {
            const fetchGame = async () => {
                setLoadingGame(true);
                try {
                    const data = await getGameDetails(seasonCode || 'E2025', gameId);
                    setGame(data.data);
                } catch (error) {
                    console.error('Failed to fetch game details:', error);
                } finally {
                    setLoadingGame(false);
                }
            };
            fetchGame();
        }
    }, [seasonCode, gameId]);

    useEffect(() => {
        if (gameId) {
            const fetchPosts = async () => {
                if (!seasonCode || !gameId) return;
                setLoadingPosts(true);
                try {
                    const data = await getPostsByGame(seasonCode, gameId, page);
                    setPosts(data.posts);
                    setTotalPages(data.totalPages);
                } catch (error) {
                    console.error('Failed to fetch posts:', error);
                } finally {
                    setLoadingPosts(false);
                }
            };
            fetchPosts();
        }
    }, [seasonCode, gameId, page]);

    const handlePostCreated = (newPost: PostType) => {
        setPosts([newPost, ...posts]);
    };

    const handlePostDeleted = (postId: string) => {
        setPosts(posts.filter(p => p._id !== postId));
    };

    const handlePostUpdated = (updatedPost: PostType) => {
        setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Button
                startIcon={<ArrowLeft size={20} />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4 }}
            >
                Back to Game Center
            </Button>

            {loadingGame ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : game ? (
                <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 4, border: '1px solid #e0e0e0' }}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={4} sx={{ mb: 4 }}>
                        <Stack alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <img src={game.home.imageUrls.crest} alt={game.home.name} style={{ width: 80, height: 80 }} />
                            <Typography variant="h6" fontWeight={800} textAlign="center">{game.home.name}</Typography>
                        </Stack>

                        <Box sx={{ textAlign: 'center', px: 2 }}>
                            {game.status === 'result' ? (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography variant="h2" fontWeight={900}>{game.home.score}</Typography>
                                    <Typography variant="h4" color="text.secondary">-</Typography>
                                    <Typography variant="h2" fontWeight={900}>{game.away.score}</Typography>
                                </Stack>
                            ) : (
                                <Typography variant="h3" fontWeight={900} color="primary">VS</Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                {game.round.name}
                            </Typography>
                        </Box>

                        <Stack alignItems="center" spacing={1} sx={{ flex: 1 }}>
                            <img src={game.away.imageUrls.crest} alt={game.away.name} style={{ width: 80, height: 80 }} />
                            <Typography variant="h6" fontWeight={800} textAlign="center">{game.away.name}</Typography>
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Calendar size={18} color="#666" />
                            <Typography variant="body2">{new Date(game.date).toLocaleDateString()}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Clock size={18} color="#666" />
                            <Typography variant="body2">{new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <MapPin size={18} color="#666" />
                            <Typography variant="body2">{game.venue.name}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            ) : (
                <Alert severity="error">Game not found.</Alert>
            )}

            {game && game.status !== 'result' && gameId && seasonCode && (
                <Box sx={{ mt: 6 }}>
                    <AiPrediction
                        seasonCode={seasonCode}
                        gameCode={gameId}
                        homeTeamName={game.home.name}
                        awayTeamName={game.away.name}
                        homeTeamImage={game.home.imageUrls.crest}
                        awayTeamImage={game.away.imageUrls.crest}
                    />
                </Box>
            )}

            <Divider sx={{ my: 6 }} />

            <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
                    Fan Discussions
                </Typography>

                {user ? (
                    <CreatePost
                        gameId={gameId || ''}
                        seasonCode={seasonCode || 'E2024'}
                        onPostCreated={handlePostCreated}
                    />
                ) : (
                    <Paper elevation={0} sx={{ p: 3, mb: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #e0e0e0', bgcolor: '#fdfdfd' }}>
                        <Typography variant="body1" color="text.secondary">
                            Login to join the discussion and share your thoughts!
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{ mt: 2, borderRadius: 10 }}
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </Button>
                    </Paper>
                )}

                {loadingPosts ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Stack spacing={3}>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onDelete={handlePostDeleted}
                                        onUpdate={handlePostUpdated}
                                    />
                                ))
                            ) : (
                                <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                                    No discussions yet. Start the conversation!
                                </Typography>
                            )}
                        </Stack>

                        {totalPages > 1 && (
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                                <Button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <Typography sx={{ alignSelf: 'center' }}>
                                    Page {page} of {totalPages}
                                </Typography>
                                <Button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </Stack>
                        )}
                    </>
                )}
            </Box>
        </Container>
    );
};

export default GameDetails;
