import { Router } from 'express';
import { AccountStatusController } from '../controllers/account-status.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
const accountStatusController = AccountStatusController.getInstance();

// Ruta para obtener el estado mensual
router.get('/monthly', authenticateToken, accountStatusController.getMonthlyStatus);

export default router; 