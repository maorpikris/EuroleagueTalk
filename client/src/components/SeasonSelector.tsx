import React from 'react';
import type { Season } from '../types/euroleague';
import { FormControl, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface Props {
    seasons: Season[];
    selectedSeasonCode: string;
    onSeasonChange: (seasonCode: string) => void;
}

const SeasonSelector: React.FC<Props> = ({ seasons, selectedSeasonCode, onSeasonChange }) => {
    const handleChange = (event: SelectChangeEvent) => {
        onSeasonChange(event.target.value);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
                value={selectedSeasonCode}
                onChange={handleChange}
                displayEmpty
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    fontWeight: 600,
                    '& .MuiSelect-select': {
                        py: 1,
                    }
                }}
            >
                {seasons.map((season) => (
                    <MenuItem key={season.code} value={season.code}>
                        {season.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SeasonSelector;
