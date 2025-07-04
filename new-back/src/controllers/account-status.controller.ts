import { Request, Response } from 'express';
import { AccountStatusService } from '../services/account-status.service';
import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/models';
import Expense from '../models/expense.model';
import { Op } from 'sequelize';
import CreditCard from '../models/credit-card.model';

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

      if (!credit_card_id) {
        res.status(400).json({ message: 'El ID de la tarjeta es requerido' });
        return;
      }

      console.log('AccountStatusController: Obteniendo estado mensual para:', {
        month,
        year,
        userId,
        creditCardId: credit_card_id
      });

      const status = await this.accountStatusService.getMonthlyStatus(
        Number(month),
        Number(year),
        userId,
        Number(credit_card_id)
      );

      res.json(status);
    } catch (error: any) {
      console.error('Error in getMonthlyStatus:', error);
      res.status(500).json({ 
        message: 'Error al obtener el estado de cuenta',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

  public async getMontoPorVencer(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      // Obtener todas las tarjetas activas del usuario
      const creditCards = await CreditCard.findAll({
        where: { user_id: userId, is_active: true },
      });
      // Para cada tarjeta, obtener su fecha de pago y los gastos próximos a esa fecha
      let gastosPorVencer: any[] = [];
      let montoPorVencer = 0;
      for (const card of creditCards) {
        if (!card.payment_due_date) continue;
        // Buscar gastos cuya fecha esté dentro de los 7 días previos a la fecha de pago
        const fechaLimite = new Date(card.payment_due_date);
        const desde = new Date(fechaLimite);
        desde.setDate(fechaLimite.getDate() - 7);
        const gastos = await Expense.findAll({
          where: {
            user_id: userId,
            credit_card_id: card.id,
            date: { [Op.between]: [desde, fechaLimite] }
          }
        });
        gastosPorVencer = gastosPorVencer.concat(gastos.map(g => ({ ...g.toJSON(), payment_due_date: card.payment_due_date })));
        montoPorVencer += gastos.reduce((sum, exp) => sum + exp.amount, 0);
      }
      res.json({ montoPorVencer, gastos: gastosPorVencer });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener monto por vencer' });
    }
  }
}

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Registrar usuario adicional
  async registerAdditionalUser(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { name, email, password, role_id } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }
      // Solo el usuario principal puede crear adicionales
      if (parentUser.parent_user_id) {
        return res.status(403).json({ message: 'Solo el usuario principal puede crear usuarios adicionales' });
      }
      const userData: Partial<IUser> = {
        name,
        email,
        password_hash: password,
        role_id: role_id || 2,
        parent_user_id: parentUser.id,
      };
      const newUser = await this.userRepository.createAdditionalUser(userData);
      return res.status(201).json({ user: newUser });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error registrando usuario adicional' });
    }
  }

  // Listar usuarios adicionales
  async getAdditionalUsers(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const users = await this.userRepository.findAdditionalUsers(parentUser.id);
      return res.json({ users });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error obteniendo usuarios adicionales' });
    }
  }

  // Eliminar usuario adicional
  async deleteAdditionalUser(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { id } = req.params;
      // Verificar que el usuario a eliminar sea adicional del usuario autenticado
      const users = await this.userRepository.findAdditionalUsers(parentUser.id);
      const userToDelete = users.find(u => u.id === Number(id));
      if (!userToDelete) {
        return res.status(404).json({ message: 'Usuario adicional no encontrado' });
      }
      await userToDelete.destroy();
      return res.json({ message: 'Usuario adicional eliminado' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error eliminando usuario adicional' });
    }
  }
} 