import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { createExpense, updateExpense } from '../../store/slices/expenseSlice';
import { Expense } from '../../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Box,
} from '@mui/material';

interface AddExpenseFormProps {
  open: boolean;
  onClose: () => void;
  selectedExpense?: Expense;
  onSubmit?: (expenseData: Partial<Expense>) => Promise<void>;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ open, onClose, selectedExpense, onSubmit }) => {
  const dispatch = useAppDispatch();
  const propCategories = useAppSelector(state => state.categories.categories);
  const categories = Array.isArray(propCategories) ? propCategories : [];
  const [formData, setFormData] = useState<Partial<Expense>>({
    amount: 0,
    description: '',
    date: new Date(),
    category_id: null,
    recurring: false,
    transaction_type: 'expense'
  });

  useEffect(() => {
    if (selectedExpense) {
      setFormData({
        amount: selectedExpense.amount,
        description: selectedExpense.description,
        date: new Date(selectedExpense.date),
        category_id: selectedExpense.category_id || null,
        recurring: selectedExpense.recurring,
        transaction_type: selectedExpense.transaction_type
      });
    } else {
      setFormData({
        amount: 0,
        description: '',
        date: new Date(),
        category_id: null,
        recurring: false,
        transaction_type: 'expense'
      });
    }
  }, [selectedExpense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        if (selectedExpense) {
          await dispatch(updateExpense({ id: selectedExpense.id, expenseData: formData }));
        } else {
          await dispatch(createExpense(formData));
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {selectedExpense ? 'Editar Movimiento' : 'Agregar Movimiento'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Monto"
            type="number"
            fullWidth
            variant="standard"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            required
          />
          <TextField
            margin="dense"
            id="description"
            label="Descripción"
            type="text"
            fullWidth
            variant="standard"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="date"
            label="Fecha"
            type="date"
            fullWidth
            variant="standard"
            value={formData.date?.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            id="category"
            select
            label="Categoría"
            fullWidth
            variant="standard"
            value={formData.category_id || ''}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? Number(e.target.value) : null })}
          >
            <MenuItem value="">Sin categoría</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.recurring}
                onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                name="recurring"
                color="primary"
              />
            }
            label="Recurrente"
          />
          <TextField
            margin="dense"
            id="transaction_type"
            select
            label="Tipo de Transacción"
            fullWidth
            variant="standard"
            value={formData.transaction_type}
            onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
          >
            <MenuItem value="expense">Gasto</MenuItem>
            <MenuItem value="payment">Pago</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{selectedExpense ? 'Actualizar' : 'Agregar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseForm; 