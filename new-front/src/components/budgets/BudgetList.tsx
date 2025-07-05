import React, { useState } from 'react';
import { Budget, Category, Expense } from '../../types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { formatCurrency } from '../../utils/formatters';

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
  categories: Category[];
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

const BudgetList: React.FC<BudgetListProps> = ({
  budgets = [],
  expenses = [],
  categories = [],
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const calculateCategoryExpenses = (categoryId: number): number => {
    return expenses
      .filter(expense => expense.category_id === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const handleDeleteClick = (budget: Budget) => {
    console.log('Click en eliminar presupuesto:', budget);
    setBudgetToDelete(budget);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log('Confirmando eliminación de presupuesto:', budgetToDelete);
    if (budgetToDelete && onDelete) {
      onDelete(budgetToDelete.id);
      setDeleteDialogOpen(false);
      setBudgetToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setBudgetToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Budget</TableCell>
              <TableCell align="right">Spent</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets && budgets.length > 0 ? (
              budgets.map((budget: Budget) => {
                const categoryExpenses = calculateCategoryExpenses(budget.category_id);
                const progress = (categoryExpenses / budget.monthly_budget) * 100;

                return (
                  <TableRow key={budget.id}>
                    <TableCell>{getCategoryName(budget.category_id)}</TableCell>
                    <TableCell align="right">{formatCurrency(budget.monthly_budget)}</TableCell>
                    <TableCell align="right">{formatCurrency(categoryExpenses)}</TableCell>
                    <TableCell>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(progress, 100)}
                        color={progress > 100 ? 'error' : 'primary'}
                      />
                      <Typography variant="caption" display="block" align="right">
                        {progress.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {onEdit && <Button onClick={() => onEdit(budget)}>Edit</Button>}
                      {onDelete && (
                        <Button onClick={() => handleDeleteClick(budget)} color="error">
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No budgets found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the budget for {budgetToDelete ? getCategoryName(budgetToDelete.category_id) : ''}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetList;