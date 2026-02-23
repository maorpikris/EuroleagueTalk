import React from 'react';
import type { Round } from '../types/euroleague';
import { Box, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    rounds: Round[];
    selectedRound: number;
    onRoundChange: (round: number) => void;
}

const RoundSelector: React.FC<Props> = ({ rounds, selectedRound, onRoundChange }) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                mb: 4
            }}
        >
            <IconButton onClick={() => scroll('left')} size="small">
                <ChevronLeft size={20} />
            </IconButton>

            <Box
                ref={scrollContainerRef}
                sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    flex: 1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' }
                }}
            >
                {rounds.map((round) => (
                    <Button
                        key={round.round}
                        variant={selectedRound === round.round ? 'outlined' : 'contained'}
                        onClick={() => onRoundChange(round.round)}
                        sx={{
                            minWidth: selectedRound === round.round ? 120 : 40,
                            height: 40,
                            borderRadius: selectedRound === round.round ? 5 : '50%',
                            bgcolor: selectedRound === round.round ? 'white' : '#f0f0f0',
                            color: selectedRound === round.round ? 'primary.main' : 'text.primary',
                            border: selectedRound === round.round ? '2px solid' : 'none',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: selectedRound === round.round ? 'white' : '#e0e0e0',
                                boxShadow: 'none',
                            }
                        }}
                    >
                        {selectedRound === round.round ? `Round ${round.round}` : round.round}
                    </Button>
                ))}
            </Box>

            <IconButton onClick={() => scroll('right')} size="small">
                <ChevronRight size={20} />
            </IconButton>
        </Box>
    );
};

export default RoundSelector;
