import React from 'react';
import { Card as MuiCard, CardContent, CardHeader, CardProps as MuiCardProps } from '@mui/material';

interface CardProps extends MuiCardProps {
  title?: string;
}

const Card: React.FC<CardProps> = ({ title, children, ...props }) => {
  return (
    <MuiCard {...props}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card; 