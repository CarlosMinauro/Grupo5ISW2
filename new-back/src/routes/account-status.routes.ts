import { Router } from 'express';
import { AccountStatusController, UserController } from '../controllers/account-status.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const accountStatusController = AccountStatusController.getInstance();
const userController = new UserController();

// Ruta para obtener el estado mensual
router.get('/monthly', authenticateToken, accountStatusController.getMonthlyStatus);

// Ruta para obtener el monto por vencer
router.get('/por-vencer', authenticateToken, accountStatusController.getMontoPorVencer);

// Registrar usuario adicional
router.post('/users/additional', authenticateToken, (req, res) => userController.registerAdditionalUser(req, res));
// Listar usuarios adicionales
router.get('/users/additional', authenticateToken, (req, res) => userController.getAdditionalUsers(req, res));
// Eliminar usuario adicional
router.delete('/users/additional/:id', authenticateToken, (req, res) => userController.deleteAdditionalUser(req, res));

export default router; 