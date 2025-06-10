import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { cardService } from '../services/cardService';
import { Card } from '../types';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Card as MuiCard,
  CardContent,
} from '@mui/material';

const CardSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cardService.getCards();
      if (response.success && response.data) {
        setCards(response.data);
      } else {
        setError(response.message || 'Error fetching cards');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las tarjetas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    fetchCards();
  }, [isAuthenticated, user, navigate, location.key]);

  const handleSelectCard = (card: Card) => {
    console.log('Selected card:', card);
    navigate(`/dashboard/${card.id}`);
  };

  const handleAddCard = () => {
    navigate('/add-card', { replace: false });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select a Card
      </Typography>
      {cards.length === 0 ? (
        <Typography>No cards found. Please add a card to continue.</Typography>
      ) : (
        <Box>
          {cards.map(card => (
            <MuiCard key={card.id} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => handleSelectCard(card)}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Card Number: {card.card_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires: {card.expiry_date}
                </Typography>
              </CardContent>
            </MuiCard>
          ))}
        </Box>
      )}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddCard}>
          Add New Card
        </Button>
      </Box>
    </Container>
  );
};

export default CardSelection; 