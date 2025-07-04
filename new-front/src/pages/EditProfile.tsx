import React from 'react';
import EditProfile from '../components/users/EditProfile';
import AdditionalUsers from '../components/users/AdditionalUsers';
import { Box, Typography } from '@mui/material';

const EditProfilePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f8fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pt: 6 }}>
      <Box sx={{ width: 700, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2, ml: 1 }}>
          Configuración
        </Typography>
        <EditProfile />
        <AdditionalUsers />
      </Box>
    </Box>
  );
};

export default EditProfilePage; 