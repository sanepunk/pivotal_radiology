import { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const tips = [
  {
    type: 'Prevention',
    text: 'Cover your mouth when coughing and ensure good ventilation in indoor spaces.',
  },
  {
    type: 'Prevention',
    text: 'Get tested for TB if you experience persistent cough lasting more than 2-3 weeks.',
  },
  {
    type: 'Fact',
    text: 'TB is curable and preventable with proper medical care and adherence to treatment.',
  },
  {
    type: 'Quote',
    text: '"Every breath counts in the fight against tuberculosis."',
  },
  {
    type: 'Remedy',
    text: 'Maintain a healthy diet rich in proteins and vitamins to boost immunity.',
  },
  {
    type: 'Prevention',
    text: 'Regular exercise and adequate sleep help strengthen your immune system.',
  },
  {
    type: 'Fact',
    text: 'Early detection and complete treatment are key to preventing TB spread.',
  },
  {
    type: 'Quote',
    text: '"Together we can end TB: Unite to make it happen."',
  },
  {
    type: 'Remedy',
    text: 'Stay hydrated and avoid smoking to support respiratory health.',
  },
  {
    type: 'Prevention',
    text: 'Keep your living space clean and well-ventilated to reduce TB transmission risk.',
  },
  {
    type: 'Fact',
    text: 'TB primarily affects the lungs but can also impact other parts of the body.',
  },
  {
    type: 'Quote',
    text: '"Every step towards TB awareness is a step towards prevention."',
  },
  {
    type: 'Remedy',
    text: 'Consult a healthcare provider if you have been in contact with someone diagnosed with TB.',
  },
  {
    type: 'Prevention',
    text: 'Vaccination with BCG can provide some protection against severe forms of TB in children.',
  },
  {
    type: 'Fact',
    text: 'Tuberculosis is caused by the bacterium Mycobacterium tuberculosis.',
  },
  {
    type: 'Quote',
    text: '"Knowledge is power in the fight against tuberculosis."',
  }
];

function LoadingTips({ progress = 0 }) {
  const [currentTip, setCurrentTip] = useState(tips[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prevTip) => {
        const currentIndex = tips.indexOf(prevTip);
        const nextIndex = (currentIndex + 1) % tips.length;
        return tips[nextIndex];
      });
    }, 3000); // Change tip every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{
          height: 8,
          borderRadius: 4,
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#000080', // Navy blue
          },
        }}
      />
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography
          variant="subtitle1"
          color="primary"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {currentTip.type}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontStyle: currentTip.type === 'Quote' ? 'italic' : 'normal',
          }}
        >
          {currentTip.text}
        </Typography>
      </Box>
    </Box>
  );
}

export default LoadingTips; 