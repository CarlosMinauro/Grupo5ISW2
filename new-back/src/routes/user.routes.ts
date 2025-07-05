import express from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const controller = new UserController();

router.get('/', authenticateToken, async (_, res) => {
  try {
    res.json({ users: [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (_, res) => {
  try {
    // const { id } = req.params;
    res.json({ user: { id: 1, name: 'Test User', email: 'test@example.com' } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // const { id } = req.params;
    const updateData = req.body;
    res.json({ 
      message: 'User updated successfully',
      user: { id: 1, ...updateData }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (_, res) => {
  try {
    // const { id } = req.params;
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta para edición de perfil
router.put('/profile', authenticateToken, controller.updateProfile);

export default router; 