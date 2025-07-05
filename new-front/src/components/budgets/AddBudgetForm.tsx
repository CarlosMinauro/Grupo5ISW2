import React, { useState, useEffect } from 'react';
import { Category, Budget } from '../../types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';

interface AddBudgetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (budgetData: any) => void;
  selectedBudget: Budget | null;
  categories: Category[];
  loading?: boolean;
  userId: number;
}

const AddBudgetForm: React.FC<AddBudgetFormProps> = ({
  open,
  onClose,
  onSubmit,
  selectedBudget,
  categories = [],
  loading = false,
  userId,
}) => {
  const [budgetData, setBudgetData] = useState({
    user_id: userId,
    monthly_budget: 0,
    category_id: 0,
  });

  useEffect(() => {
    if (selectedBudget) {
      setBudgetData({
        user_id: userId,
        monthly_budget: selectedBudget.monthly_budget,
        category_id: selectedBudget.category_id,
      });
    } else {
      setBudgetData({
        user_id: userId,
        monthly_budget: 0,
        category_id: 0,
      });
    }
  }, [selectedBudget, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBudgetData((prev) => ({
      ...prev,
      [name]: name === 'category_id' ? Number(value) : parseFloat(value),
    }));
  };

  const handleSubmit = () => {
    // Ensure all required fields are present and properly formatted
    // Validate category_id before submitting for update
    if (selectedBudget && budgetData.category_id <= 0) {
      // Optionally set an error state or show a message to the user
      console.error("Category must be selected for update.");
      // Prevent form submission
      return;
    }

    const formattedData = {
      ...budgetData,
      monthly_budget: Number(budgetData.monthly_budget),
      category_id: Number(budgetData.category_id),
    };

    if (selectedBudget) {
      // If editing, include the id
      onSubmit({
        ...formattedData,
        id: selectedBudget.id
      });
    } else {
      // If creating, just use the formatted data
      onSubmit(formattedData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {selectedBudget ? 'Edit Budget' : 'Add Budget'}
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
              label="Monthly Budget"
              name="monthly_budget"
              type="number"
              value={budgetData.monthly_budget}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Category"
              name="category_id"
              value={budgetData.category_id}
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
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !budgetData.category_id || budgetData.monthly_budget <= 0}
        >
          {selectedBudget ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBudgetForm; 