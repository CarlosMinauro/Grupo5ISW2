import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import { RootState } from '../../store';

const CategorySummary: React.FC = () => {
  const { expenses } = useSelector((state: RootState) => state.expenses);
  const { categories } = useSelector((state: RootState) => state.categories);

  const getCategoryExpenses = (categoryId: number) => {
    return expenses
      .filter(expense => expense.category_id === categoryId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  const categoryExpenses = categories.map(category => ({
    id: category.id,
    name: category.name,
    amount: getCategoryExpenses(category.id),
    percentage: totalExpenses > 0 
      ? (getCategoryExpenses(category.id) / totalExpenses) * 100 
      : 0
  })).sort((a, b) => b.amount - a.amount);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Gastos por Categoría
      </Typography>
      <List>
        {categoryExpenses.map((category, index) => (
          <React.Fragment key={category.id}>
            <ListItem>
              <ListItemText
                primary={category.name}
                secondary={`${category.percentage.toFixed(1)}% del total`}
              />
              <Typography variant="body2" color="primary">
                ${category.amount.toFixed(2)}
              </Typography>
            </ListItem>
            {index < categoryExpenses.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {categoryExpenses.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            No hay gastos registrados
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default CategorySummary; 