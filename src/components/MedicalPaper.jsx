import { Paper } from '@mui/material';

function MedicalPaper(props) {
  const { children, ...otherProps } = props;
  
  return (
    <Paper
      elevation={3}
      {...otherProps}
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: '0 8px 24px rgba(0, 0, 128, 0.15)',
        backgroundColor: '#ffffff',
        position: 'relative',
        zIndex: 1,
        ...otherProps.sx
      }}
    >
      {children}
    </Paper>
  );
}

export default MedicalPaper;
