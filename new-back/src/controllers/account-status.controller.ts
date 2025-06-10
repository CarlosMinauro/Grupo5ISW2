import { Request, Response } from 'express';
import { AccountStatusService } from '../services/account-status.service';

export class AccountStatusController {
  private static instance: AccountStatusController;
  private accountStatusService: AccountStatusService;

  private constructor() {
    this.accountStatusService = AccountStatusService.getInstance();
  }

  public static getInstance(): AccountStatusController {
    if (!AccountStatusController.instance) {
      AccountStatusController.instance = new AccountStatusController();
    }
    return AccountStatusController.instance;
  }

  public getMonthlyStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { month, year, credit_card_id } = req.query;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return;
      }

      if (!month || !year) {
        res.status(400).json({ message: 'Mes y año son requeridos' });
        return;
      }

      const status = await this.accountStatusService.getMonthlyStatus(
        Number(month),
        Number(year),
        userId,
        credit_card_id ? Number(credit_card_id) : undefined
      );

      res.json(status);
    } catch (error) {
      console.error('Error in getMonthlyStatus:', error);
      res.status(500).json({ 
        message: 'Error al obtener el estado de cuenta',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };
} 