import { Box } from '@mui/material';
import lungImage from '../assets/background.jpg';

// This component is now a simpler version since we have a global background wrapper
// It's kept for backward compatibility with existing code
function BackgroundImage() {
  // This component doesn't need to actually render anything now that we have global background
  // But we'll keep it to avoid breaking changes in components that use it
  return null;
}

export default BackgroundImage;
