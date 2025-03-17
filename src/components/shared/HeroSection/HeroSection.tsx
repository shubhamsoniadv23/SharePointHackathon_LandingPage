import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { ISharedComponentProps } from '../../../webparts/landingPage/components/ILandingPageProps';

const HeroSection: React.FC<ISharedComponentProps> = ({ context }) => {
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const getUserName = async () => {
      try {
        const client = await context.msGraphClientFactory.getClient("3");
        const user = await client.api('/me').select('displayName').get();

        // Extract first name from displayName
        const firstNameOnly = user.displayName?.split(' ')[0] || '';
        setFirstName(firstNameOnly);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    void getUserName();
  }, [context.msGraphClientFactory]);

  return (
    <Box
      id='home'
      sx={{
        position: 'relative',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Hero Background Image */}
      <Box
        component="img"
        src="https://advaiya.sharepoint.com/:i:/r/sites/SS-LearningManagement/Shared%20Documents/General/tropical_background_2.png?csf=1&web=1&e=tQaj0q"
        alt="Hero Background"
        sx={{
          position: 'absolute',
          width: '100%',
          height: '400px',
          objectFit: 'cover',
          filter: 'brightness(0.6)', // Adjust contrast for readability
          zIndex: 0
        }}
      />

      {/* Welcome Text Overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '0 20px'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            fontFamily: "'Dancing Script', 'Pacifico', 'Great Vibes', 'Lobster', 'Parisienne', cursive",
            fontWeight: 600,
            letterSpacing: '0.05em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
          }}
        >
          Welcome,
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '3rem', sm: '4rem', md: '4rem' },
              background: 'linear-gradient(45deg, #ffffff 30%, #e0e0e0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              marginLeft: '8px',
              fontFamily: "'Dancing Script', 'Pacifico', 'Great Vibes', 'Lobster', 'Parisienne', cursive"
            }}
          >
            {firstName}!
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroSection;
