import React, { useState } from 'react';
import { Expense, Category } from '../../types';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses = [],
  categories: propCategories = [],
  onEdit,
  onDelete,
  loading = false,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const categories = Array.isArray(propCategories) ? propCategories : [];

  const getCategoryName = (categoryId: number | null | undefined): string => {
    if (categoryId == null) return 'Sin categoría';
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete && onDelete) {
      onDelete(expenseToDelete.id);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
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
              <TableCell>Fecha</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses && expenses.length > 0 ? (
              expenses.map((expense: Expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{getCategoryName(expense.category_id)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.transaction_type === 'expense' ? 'Gasto' : expense.transaction_type === 'payment' ? 'Pago' : expense.transaction_type}</TableCell>
                  <TableCell align="right">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    {onEdit && <Button onClick={() => onEdit(expense)}>Editar</Button>}
                    {onDelete && (
                      <Button onClick={() => handleDeleteClick(expense)} color="error">
                        Eliminar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No se encontraron gastos
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
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que deseas eliminar el gasto "{expenseToDelete?.description}" por {expenseToDelete ? formatCurrency(expenseToDelete.amount) : ''}?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseList; 