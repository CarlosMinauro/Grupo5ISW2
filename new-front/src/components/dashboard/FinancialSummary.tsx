/**
 * Componente FinancialSummary
 * 
 * Este componente implementa el patrón Componente Presentacional y sigue
 * varios principios SOLID:
 * 
 * 1. Principio de Responsabilidad Única (SRP): El componente es responsable
 *    solo de mostrar la información del resumen financiero.
 * 
 * 2. Principio de Inversión de Dependencias (DIP): El componente depende de
 *    la interfaz del store de Redux en lugar de implementaciones concretas.
 * 
 * 3. Principio de Segregación de Interfaces (ISP): El componente solo utiliza
 *    las partes específicas del store de Redux que necesita (totalBudget y
 *    totalExpenses).
 * 
 * El componente también implementa el patrón Observer al suscribirse a los
 * cambios del store de Redux y actualizar su visualización en consecuencia.
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgets } from '../../store/slices/budgetSlice';
import { fetchExpenses } from '../../store/slices/expenseSlice';
import { formatCurrency } from '../../utils/formatters';
import { RootState, AppDispatch } from '../../store';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

const FinancialSummary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalBudget, loading: budgetsLoading } = useSelector((state: RootState) => state.budgets);
  const { totalExpenses, loading: expensesLoading } = useSelector((state: RootState) => state.expenses);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchBudgets()),
          dispatch(fetchExpenses())
        ]);
      } catch (error) {
        console.error('Error loading financial data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  if (budgetsLoading || expensesLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Financial Summary
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Total Budget</Typography>
          <Typography variant="h4">{formatCurrency(totalBudget)}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Total Expenses</Typography>
          <Typography variant="h4">{formatCurrency(totalExpenses)}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Budget Usage</Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            color={percentage > 100 ? 'error' : 'primary'}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" sx={{ mt: 1 }}>
            {percentage.toFixed(1)}% of budget used
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FinancialSummary; 