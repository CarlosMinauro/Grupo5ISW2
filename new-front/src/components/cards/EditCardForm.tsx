import React, { useState } from 'react';
import { Card } from '../../interfaces/models';
import { cardService } from '../../services/cardService';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';

interface EditCardFormProps {
  card: Card;
  onClose: () => void;
  onSaved: () => void;
}

const EditCardForm: React.FC<EditCardFormProps> = ({ card, onClose, onSaved }) => {
  const [form, setForm] = useState({
    card_number: card.card_number,
    card_holder_name: card.card_holder_name,
    expiration_date: card.expiration_date ? card.expiration_date.toISOString().slice(0, 10) : '',
    brand: card.brand,
    bank: card.bank,
    cut_off_date: card.cut_off_date ? card.cut_off_date.toISOString().slice(0, 10) : '',
    payment_due_date: card.payment_due_date ? card.payment_due_date.toISOString().slice(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cardData: Partial<Card> = {
        card_number: form.card_number,
        card_holder_name: form.card_holder_name,
        expiration_date: form.expiration_date ? new Date(form.expiration_date) : null,
        brand: form.brand,
        bank: form.bank,
        cut_off_date: form.cut_off_date ? new Date(form.cut_off_date) : null,
        payment_due_date: form.payment_due_date ? new Date(form.payment_due_date) : null,
      };
      await cardService.updateCard(card.id, cardData);
      onSaved();
      onClose();
    } catch {
      setError('Error al actualizar tarjeta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Editar Tarjeta</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Número de Tarjeta" name="card_number" value={form.card_number} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Nombre del Titular" name="card_holder_name" value={form.card_holder_name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Fecha de Expiración" name="expiration_date" type="date" value={form.expiration_date} onChange={handleChange} fullWidth margin="normal" required InputLabelProps={{ shrink: true }} />
          <TextField label="Marca" name="brand" value={form.brand} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Banco" name="bank" value={form.bank} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Fecha de Corte" name="cut_off_date" type="date" value={form.cut_off_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Fecha de Pago" name="payment_due_date" type="date" value={form.payment_due_date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditCardForm; 