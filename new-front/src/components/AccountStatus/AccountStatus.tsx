import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress
} from '@mui/material';
import { AccountStatusService, MonthlyStatus } from '../../services/account-status.service';

interface AccountStatusProps {
  creditCardId?: number;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ creditCardId }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [status, setStatus] = useState<MonthlyStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const accountStatusService = AccountStatusService.getInstance();

  useEffect(() => {
    const fetchMonthlyStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await accountStatusService.getMonthlyStatus(selectedMonth, selectedYear, creditCardId);
        setStatus(data);
      } catch (err) {
        setError('Error al cargar el estado de cuenta');
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStatus();
  }, [selectedMonth, selectedYear, creditCardId]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Mes</InputLabel>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              label="Mes"
            >
              {months.map((month, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Año</InputLabel>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              label="Año"
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={4} mb={2}>
        <hr style={{ border: 'none', borderTop: '2px solid #eee', margin: 0 }} />
      </Box>

      {status && (
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Pagado
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ${(status.totalPaid ?? 0).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Gastos Totales
                  </Typography>
                  <Typography variant="h4" color="error">
                    ${(status.totalExpenses ?? 0).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    color={status.balance >= 0 ? 'success.main' : 'error.main'}
                  >
                    ${(status.balance ?? 0).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Gastos por Categoría
            </Typography>
            <Grid container spacing={2}>
              {status.expensesByCategory.map((category) => (
                <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {category.categoryName}
                      </Typography>
                      <Typography variant="h6" color="error">
                        ${(category.amount ?? 0).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AccountStatus; 