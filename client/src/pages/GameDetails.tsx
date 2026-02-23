import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const GameDetails: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Button
                startIcon={<ArrowLeft size={20} />}
                onClick={() => navigate(-1)}
                sx={{ mb: 4 }}
            >
                Back to Game Center
            </Button>

            <Box sx={{ bgcolor: 'white', p: 6, borderRadius: 4, border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom fontWeight={800}>
                    Game Details
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Game ID: {gameId}
                </Typography>
                <Box sx={{ p: 4, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography variant="body1">
                        This is a placeholder for the game details page.
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
                        Statistics, play-by-play, and lineups will be displayed here in the future.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default GameDetails;
