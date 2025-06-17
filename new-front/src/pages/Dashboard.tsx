/**
 * Componente Dashboard
 * 
 * Este componente implementa el Patrón Compuesto al componer múltiples
 * componentes más pequeños en una interfaz de dashboard cohesiva. Sigue varios
 * principios SOLID:
 * 
 * 1. Principio de Responsabilidad Única (SRP): El componente Dashboard es
 *    responsable solo del diseño y composición de los componentes hijos.
 * 
 * 2. Principio de Segregación de Interfaces (ISP): Cada componente hijo recibe
 *    solo las props que necesita a través del store de Redux.
 * 
 * 3. Principio de Inversión de Dependencias (DIP): El componente depende de
 *    abstracciones (store de Redux) en lugar de implementaciones concretas.
 * 
 * El componente utiliza el patrón Contenedor/Presentacional, donde actúa como
 * un componente contenedor que gestiona el diseño y la composición de los
 * componentes presentacionales (FinancialSummary, BudgetOverview, etc.).
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { expenseService, budgetService } from '../services/api';
import ExpenseList from '../components/expenses/ExpenseList';
import BudgetList from '../components/budgets/BudgetList';
import AddExpenseForm from '../components/expenses/AddExpenseForm';
import AddBudgetForm from '../components/budgets/AddBudgetForm';
import { Expense, Budget, Category } from '../types';
import AccountStatus from '../components/AccountStatus/AccountStatus';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { creditCardId } = useParams<{ creditCardId: string }>();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [openAddExpense, setOpenAddExpense] = useState(false);
  const [openAddBudget, setOpenAddBudget] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [renderKey, setRenderKey] = useState(0);
  const currentCardId = creditCardId ? Number(creditCardId) : undefined;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching data for card:', currentCardId);

        dispatch(fetchCategories() as any);

        const [expensesRes, budgetsRes] = await Promise.all([
          expenseService.getExpenses(currentCardId),
          budgetService.getBudgets(),
        ]);

        console.log('Data fetched:', {
          expenses: expensesRes.data.length,
          budgets: budgetsRes.data.length,
          categories: categories.length
        });
        console.log('Categories from Redux state (after fetchCategories dispatch):', categories);

        setExpenses(expensesRes.data);
        setBudgets(budgetsRes.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate, currentCardId, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleAddExpense = async (expenseData: Partial<Expense>) => {
    try {
      const response = await expenseService.createExpense({ 
        ...expenseData, 
        user_id: user?.id || 0,
        credit_card_id: currentCardId,
        date: expenseData.date instanceof Date ? expenseData.date : new Date(expenseData.date || new Date())
      });
      if (response.success && response.data) {
        setExpenses(prev => {
          const newExpenses = [...prev, response.data];
          return newExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        setOpenAddExpense(false);
        setSelectedExpense(null);
        setRenderKey(prev => prev + 1);
        setError(null);
      } else {
        setError(response.message || 'Error adding expense');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar el gasto');
    }
  };

  const handleEditExpense = async (expenseData: Partial<Expense>) => {
    try {
      if (!expenseData.id) return;
      const response = await expenseService.updateExpense(expenseData.id, {
        ...expenseData,
        date: expenseData.date instanceof Date ? expenseData.date : new Date(expenseData.date || new Date())
      });
      if (response.success && response.data) {
        setExpenses(prev => prev.map(exp => exp.id === expenseData.id ? response.data : exp));
        setOpenAddExpense(false);
        setSelectedExpense(null);
        setRenderKey(prev => prev + 1);
      } else {
        setError(response.message || 'Error updating expense');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el gasto');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      console.log('Iniciando eliminación de gasto:', id);
      const response = await expenseService.deleteExpense(id);
      console.log('Respuesta del servidor:', response);
      if (response.success) {
        console.log('Gasto eliminado exitosamente');
        setExpenses(prev => {
          console.log('Estado anterior de gastos:', prev);
          const newExpenses = prev.filter(expense => expense.id !== id);
          console.log('Nuevo estado de gastos:', newExpenses);
          return newExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        setRenderKey(prev => prev + 1);
        setError(null);
      } else {
        console.error('Error en la respuesta del servidor:', response.message);
        setError(response.message || 'Failed to delete expense');
      }
    } catch (err: any) {
      console.error('Error al eliminar gasto:', err);
      setError(err.response?.data?.message || 'Error al eliminar el gasto');
    }
  };

  const handleAddBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await budgetService.createBudget({ ...budgetData, user_id: user?.id || 0 });
      if (response.success && response.data) {
        setBudgets(prev => {
          const newBudgets = [...prev, response.data];
          return newBudgets.sort((a, b) => {
            const categoryA = categories.find(cat => cat.id === a.category_id)?.name || '';
            const categoryB = categories.find(cat => cat.id === b.category_id)?.name || '';
            return categoryA.localeCompare(categoryB);
          });
        });
        setOpenAddBudget(false);
        setSelectedBudget(null);
        setRenderKey(prev => prev + 1);
        setError(null);
      } else {
        setError(response.message || 'Error adding budget');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar el presupuesto');
    }
  };

   const handleEditBudget = async (budgetData: Budget) => {
    try {
      if (!budgetData.id) return;
      const response = await budgetService.updateBudget(budgetData.id, budgetData);
      if (response.success && response.data) {
        setBudgets(prev => prev.map(bud => bud.id === budgetData.id ? response.data : bud));
        setOpenAddBudget(false);
        setSelectedBudget(null);
        setRenderKey(prev => prev + 1);
      } else {
        setError(response.message || 'Error updating budget');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el presupuesto');
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      const response = await budgetService.deleteBudget(id);
      if (response.success) {
        setBudgets(prev => prev.filter(budget => budget.id !== id));
        setRenderKey(prev => prev + 1);
      } else {
        setError(response.message || 'Failed to delete budget');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar el presupuesto');
    }
  };

  const handleOpenAddExpense = () => {
    setSelectedExpense(null);
    setOpenAddExpense(true);
  };

  const handleCloseAddExpense = () => {
    setOpenAddExpense(false);
    setSelectedExpense(null);
  };

  const handleOpenEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setOpenAddExpense(true);
  };

  const handleOpenAddBudget = () => {
    setSelectedBudget(null);
    setOpenAddBudget(true);
  };

  const handleCloseAddBudget = () => {
    setOpenAddBudget(false);
    setSelectedBudget(null);
  };

  const handleOpenEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setOpenAddBudget(true);
  };

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
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">
                Dashboard
              </Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/card-selection')}
                  sx={{ mr: 2 }}
                >
                  Cambiar Tarjeta
                </Button>
                <Button variant="outlined" color="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Box>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">Movimientos Recientes</Typography>
              <Button variant="contained" onClick={handleOpenAddExpense} sx={{ mb: 2 }}>
                Agregar Movimiento
              </Button>
            </Box>
            <Paper sx={{ p: 2 }}>
              <ExpenseList
                key={renderKey}
                expenses={expenses}
                categories={categories}
                onEdit={handleOpenEditExpense}
                onDelete={handleDeleteExpense}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" onClick={handleOpenAddBudget} sx={{ mb: 2 }}>
              Agregar Presupuesto
            </Button>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Presupuestos
              </Typography>
              <BudgetList budgets={budgets} expenses={expenses} categories={categories} onEdit={handleOpenEditBudget} onDelete={handleDeleteBudget} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Account Status</Typography>
              <AccountStatus creditCardId={currentCardId} />
            </Paper>
          </Grid>
        </Grid>

        <AddExpenseForm
          open={openAddExpense}
          onClose={handleCloseAddExpense}
          onSubmit={selectedExpense ? handleEditExpense : handleAddExpense}
          selectedExpense={selectedExpense || undefined}
        />
        <AddBudgetForm
          open={openAddBudget}
          onClose={handleCloseAddBudget}
          onSubmit={selectedBudget ? handleEditBudget : handleAddBudget}
          selectedBudget={selectedBudget}
          categories={categories}
          userId={user.id}
        />
      </Box>
    </Container>
  );
};

export default Dashboard; 