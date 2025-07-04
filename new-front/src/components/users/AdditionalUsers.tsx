import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IAdditionalUser } from '../../interfaces/models';
import { registerAdditionalUser, getAdditionalUsers, deleteAdditionalUser } from '../../services/api';
import './AdditionalUsers.css';

const AdditionalUsers: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState<IAdditionalUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdditionalUsers();
      setUsers(res.data.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al obtener usuarios adicionales');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerAdditionalUser({ name, email, password });
      fetchUsers();
      setSuccess('Usuario adicional agregado');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario adicional');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError('');
    setLoading(true);
    try {
      await deleteAdditionalUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar usuario adicional');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)} sx={{ width: '100%', boxShadow: 2, borderRadius: 2, background: 'white', mb: 2, px: 0 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">Usuarios Adicionales</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleAddUser} sx={{ mb: 2 }}>
          <TextField
            label="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Agregando...' : 'Agregar usuario'}
          </Button>
        </Box>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Lista de usuarios adicionales:</Typography>
        {users.length === 0 && <Typography color="text.secondary">No hay usuarios adicionales.</Typography>}
        {users.map((u, idx) => (
          <Paper key={idx} sx={{ p: 2, my: 1 }}>
            <Typography><b>Nombre:</b> {u.name}</Typography>
            <Typography><b>Email:</b> {u.email}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(u.id)}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Eliminar
            </Button>
          </Paper>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default AdditionalUsers; 