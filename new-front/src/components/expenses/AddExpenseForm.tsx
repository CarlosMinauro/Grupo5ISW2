import React, { useState, useEffect } from 'react';
import { Category, Expense } from '../../types';
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
  onSubmit: (expenseData: any) => void;
  selectedExpense: Expense | null;
  categories: Category[];
  loading?: boolean;
  userId: number;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  open,
  onClose,
  onSubmit,
  selectedExpense,
  categories = [],
  loading = false,
  userId,
}) => {
  const [expenseData, setExpenseData] = useState({
    user_id: userId,
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    category_id: 0,
    recurring: false,
  });

  useEffect(() => {
    if (selectedExpense) {
      setExpenseData({
        user_id: userId,
        amount: selectedExpense.amount,
        description: selectedExpense.description,
        date: selectedExpense.date,
        category_id: selectedExpense.category_id,
        recurring: selectedExpense.recurring,
      });
    } else {
      setExpenseData({
        user_id: userId,
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        category_id: 0,
        recurring: false,
      });
    }
  }, [selectedExpense, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseData((prev) => ({
      ...prev,
      [name]: name === 'category_id' ? Number(value) : name === 'recurring' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = () => {
    // Ensure all required fields are present and properly formatted
    // Also validate category_id before submitting for update
    if (selectedExpense && expenseData.category_id <= 0) {
      // Optionally set an error state or show a message to the user
      console.error("Category must be selected for update.");
      // Prevent form submission
      return;
    }

    const formattedData = {
      ...expenseData,
      amount: Number(expenseData.amount),
      category_id: Number(expenseData.category_id),
      // Parse the date string explicitly before converting to ISO 8601
      date: new Date(expenseData.date + 'T00:00:00Z').toISOString(),
      description: expenseData.description.trim(),
      recurring: Boolean(expenseData.recurring),
    };

    if (selectedExpense) {
      // If editing, include the id
      onSubmit({
        ...formattedData,
        id: selectedExpense.id
      });
    } else {
      // If creating, just use the formatted data
      onSubmit(formattedData);
    }

    // Reset form data after submission
    setExpenseData({
      user_id: userId,
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      category_id: 0,
      recurring: false,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {selectedExpense ? 'Edit Expense' : 'Add Expense'}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Amount"
              name="amount"
              type="number"
              value={expenseData.amount}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={expenseData.description}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 255 }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date"
              name="date"
              type="date"
              value={expenseData.date}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Category"
              name="category_id"
              value={expenseData.category_id}
              onChange={handleChange}
              required
            >
              {categories && categories.length > 0 ? (
                categories.map((category: Category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No categories available</MenuItem>
              )}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expenseData.recurring}
                  onChange={handleChange}
                  name="recurring"
                />
              }
              label="Recurring"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !expenseData.description || !expenseData.category_id || expenseData.amount <= 0}
        >
          {selectedExpense ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddExpenseForm; 