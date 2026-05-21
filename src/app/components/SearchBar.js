"use client";
// components/SearchBar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        onSearch(val);
      }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(input);
    return () => debouncedSearch.cancel();
  }, [input, debouncedSearch]);

  return (
    <TextField
      fullWidth
      placeholder="Search recipes ..."
      variant="outlined"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      sx={{
        maxWidth: 600,
        '& .MuiOutlinedInput-root': {
          borderRadius: '30px',
          backgroundColor: 'white',
          borderColor: '#ff6f00',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff6f00',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff6f00',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

