import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import type { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface FilterBarProps {
  filterCategory: string;
  filterType: string;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onTypeChange: (type: string) => void;
}

export const FilterBar = ({
  filterCategory,
  filterType,
  categories,
  onCategoryChange,
  onTypeChange
}: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <Box sx={{ mb: 3 }}>
      <Button
        variant="outlined"
        onClick={() => setShowFilters(!showFilters)}
        startIcon={showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        endIcon={<FilterListIcon />}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <Collapse in={showFilters}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                label="Filter by Category"
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => onTypeChange(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="mcq">Multiple Choice</MenuItem>
                <MenuItem value="open_ended">Open Ended</MenuItem>
                <MenuItem value="true_false">True/False</MenuItem>
                <MenuItem value="short_answer">Short Answer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
