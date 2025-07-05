import React, { useState, useEffect } from 'react';
import { updateProfile } from '../../services/account-status.service';
import { TextField, Button, Alert, Typography, Paper, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';

const EditProfile: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill form with user data from localStorage if available
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setName(user.name || '');
        setEmail(user.email || '');
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    // Prevent submitting if name or email is empty
    if (!name.trim() || !email.trim()) {
      setError('El nombre y el email no pueden estar vacíos');
      setLoading(false);
      return;
    }
    try {
      await updateProfile({ name, email, password: password || undefined });
      setSuccess('Perfil actualizado correctamente');
      // Do not clear fields after success, keep them filled
      // setName('');
      // setEmail('');
      setPassword('');
      // Optionally update localStorage user
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = name;
        user.email = email;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion defaultExpanded sx={{ width: '100%', boxShadow: 2, borderRadius: 2, background: 'white', mb: 2, px: 0 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">Editar Perfil</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Paper elevation={0} sx={{ p: 0, boxShadow: 'none', background: 'transparent' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 1 }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Actualiza tu información personal
            </Typography>
          </div>
          <Divider sx={{ mb: 3 }} />
          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess('')}
            >
              {success}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{ sx: { borderRadius: 2, background: '#f4f6fb' } }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{ sx: { borderRadius: 2, background: '#f4f6fb' } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Nueva contraseña (opcional)"
              InputProps={{ sx: { borderRadius: 2, background: '#f4f6fb' } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: 16, borderRadius: 2, boxShadow: 2 }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default EditProfile; 