import React from 'react';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * A styled Paper component with a medical theme
 * Provides consistent styling with transparency to show the lung background
 * Used across all pages for visual consistency
 */
const MedicalPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '16px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  position: 'relative',
  zIndex: 1,
  '&:hover': {
    boxShadow: '0 8px 40px rgba(0, 0, 128, 0.15)',
  },
}));

export default MedicalPaper; 