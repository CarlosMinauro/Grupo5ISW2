import React, { useEffect, useState } from 'react';
import { getMontoPorVencer } from '../../services/account-status.service';
import { Paper, Alert, Typography, CircularProgress, Box } from '@mui/material';

const MontoPorVencer: React.FC = () => {
  const [monto, setMonto] = useState<number>(0);
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonto = async () => {
      try {
        setLoading(true);
        const data = await getMontoPorVencer();
        setMonto(data.montoPorVencer);
        setGastos(data.gastos);
      } catch (err) {
        setError('Error al cargar el monto por vencer');
      } finally {
        setLoading(false);
      }
    };
    fetchMonto();
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 2, minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
      <Typography variant="h6" component="h2" fontWeight={600} sx={{ mb: 2 }}>
        Monto por vencer
      </Typography>
      {loading && (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={80}>
          <CircularProgress size={28} />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>
      )}
      {!loading && !error && (
        <>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Próximos 7 días: <span style={{ color: '#c00', fontWeight: 600 }}>${monto.toFixed(2)}</span>
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {gastos.length === 0 && <li>No hay gastos próximos a vencer.</li>}
            {gastos.map(gasto => (
              <li key={gasto.id}>
                {gasto.description} - ${gasto.amount} - Vence: {gasto.date}
              </li>
            ))}
          </ul>
        </>
      )}
    </Paper>
  );
};

export default MontoPorVencer; 