import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { cardService } from '../services/cardService';
import { Container, Typography, Button, Box, TextField, Alert } from '@mui/material';

const AddCard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    card_number: '',
    card_holder_name: '',
    expiration_date: '',
    brand: '',
    bank: '',
    cut_off_date: '',
    payment_due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      card_number: '',
      card_holder_name: '',
      expiration_date: '',
      brand: '',
      bank: '',
      cut_off_date: '',
      payment_due_date: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cardData = {
        ...form,
        expiration_date: form.expiration_date ? new Date(form.expiration_date) : null,
        cut_off_date: form.cut_off_date ? new Date(form.cut_off_date) : null,
        payment_due_date: form.payment_due_date ? new Date(form.payment_due_date) : null,
      };
      console.log('Enviando datos de tarjeta:', cardData);
      const response = await cardService.createCard(cardData);
      console.log('Respuesta del servidor:', response);
      if (response.success) {
        console.log('Tarjeta agregada exitosamente');
        resetForm();
        navigate('/card-selection', { replace: true });
      } else {
        console.error('Error al agregar tarjeta:', response.message);
        setError(response.message || 'Error al agregar la tarjeta');
      }
    } catch (err: any) {
      console.error('Error en la petición:', err);
      setError('Error al agregar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Agregar Nueva Tarjeta
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Número de Tarjeta"
          name="card_number"
          value={form.card_number}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Nombre del Titular"
          name="card_holder_name"
          value={form.card_holder_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Fecha de Expiración"
          name="expiration_date"
          type="date"
          value={form.expiration_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Marca"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Banco"
          name="bank"
          value={form.bank}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Corte"
          name="cut_off_date"
          type="date"
          value={form.cut_off_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha de Pago"
          name="payment_due_date"
          type="date"
          value={form.payment_due_date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar Tarjeta'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/card-selection')}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AddCard; 