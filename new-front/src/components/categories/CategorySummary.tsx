import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Expense } from '../../types';

interface CategorySummaryProps {
  categoryId: number;
}

export const CategorySummary: React.FC<CategorySummaryProps> = ({ categoryId }) => {
  const expenses = useAppSelector(state => state.expenses.expenses);
  const category = useAppSelector(state => 
    state.categories.categories.find(c => c.id === categoryId)
  );

  const categoryExpenses = expenses.filter(expense => 
    expense.category_id === categoryId && expense.transaction_type === 'expense'
  );

  const totalExpenses = categoryExpenses.reduce((total, expense) => total + expense.amount, 0);

  if (!category) return null;

  return (
    <div className="category-summary">
      <h3>{category.name}</h3>
      <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
      <p>Number of Expenses: {categoryExpenses.length}</p>
    </div>
  );
}; 