import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../store/slices/categorySlice';
import { fetchExpenses } from '../../store/slices/expenseSlice';
import { Category, Expense } from '../../types';
import { RootState, AppDispatch } from '../../store';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { formatCurrency } from '../../utils/formatters';

interface CategoryWithTotal extends Category {
  total: number;
}

const CategorySummary: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);
  const { expenses, loading: expensesLoading } = useSelector((state: RootState) => state.expenses);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCategories()),
          dispatch(fetchExpenses())
        ]);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadData();
  }, [dispatch]);

  const calculateCategoryTotal = (categoryId: number): number => {
    return expenses
      .filter((expense: Expense) => expense.category_id === categoryId)
      .reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  };

  const getTopCategories = (): CategoryWithTotal[] => {
    return categories
      .map((category: Category) => ({
        ...category,
        total: calculateCategoryTotal(category.id)
      }))
      .sort((a: CategoryWithTotal, b: CategoryWithTotal) => b.total - a.total)
      .slice(0, 5);
  };

  if (categoriesLoading || expensesLoading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const topCategories = getTopCategories();
  const totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Category Summary
      </Typography>
      <Paper>
        <List>
          {topCategories.map((category: CategoryWithTotal) => {
            const percentage = totalExpenses > 0 ? (category.total / totalExpenses) * 100 : 0;
            return (
              <React.Fragment key={category.id}>
                <ListItem>
                  <ListItemText
                    primary={category.name}
                    secondary={`${formatCurrency(category.total)} (${percentage.toFixed(1)}%)`}
                  />
                </ListItem>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{ mx: 2, mb: 1 }}
                />
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default CategorySummary; 