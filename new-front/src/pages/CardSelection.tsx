import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { cardService } from '../services/cardService';
import { Card } from '../interfaces/models';
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
  IconButton,
} from '@mui/material';
import { formatDate } from '../utils/formatters';
import EditCardForm from '../components/cards/EditCardForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';

const CardSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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

  const handleEditCard = (card: Card) => setEditCard(card);
  const handleCloseEdit = () => setEditCard(null);

  const handleDeleteCard = async (id: number) => {
    try {
      await cardService.deleteCard(id);
      setCards(cards.filter(c => c.id !== id));
      setSnackbar({ open: true, message: 'Tarjeta eliminada correctamente', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar tarjeta', severity: 'error' });
    }
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h4" gutterBottom>
          Selecciona una Tarjeta
        </Typography>
        <Button variant="outlined" color="secondary" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>
          Cerrar sesión
        </Button>
      </Box>
      {cards.length === 0 ? (
        <Typography mb={4}>No se encontraron tarjetas. Por favor, agrega una tarjeta para continuar.</Typography>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {cards.map(card => (
            <MuiCard key={card.id} sx={{ mb: 2, width: 320, boxShadow: 3, borderRadius: 2, position: 'relative', transition: '0.2s', '&:hover': { boxShadow: 6, borderColor: 'primary.main' } }}>
              <CardContent onClick={() => handleSelectCard(card)} sx={{ cursor: 'pointer' }}>
                <Typography variant="h6" component="div">
                  **** **** **** {card.card_number.slice(-4)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vence: {formatDate(card.expiration_date ?? '')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.brand} - {card.bank}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" pr={2} pb={1}>
                <IconButton onClick={(e) => { e.stopPropagation(); handleEditCard(card); }}><EditIcon /></IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteCard(card.id); }}><DeleteIcon /></IconButton>
              </Box>
            </MuiCard>
          ))}
        </Box>
      )}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleAddCard} sx={{ borderRadius: 2 }}>
          Agregar Nueva Tarjeta
        </Button>
      </Box>
      {editCard && (
        <EditCardForm card={editCard} onClose={handleCloseEdit} onSaved={fetchCards} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{ style: { backgroundColor: snackbar.severity === 'success' ? '#43a047' : '#d32f2f', color: '#fff' } }}
      />
    </Container>
  );
};

export default CardSelection; 