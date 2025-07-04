"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.AccountStatusController = void 0;
const account_status_service_1 = require("../services/account-status.service");
const user_repository_1 = require("../repositories/user.repository");
const expense_model_1 = __importDefault(require("../models/expense.model"));
const sequelize_1 = require("sequelize");
const credit_card_model_1 = __importDefault(require("../models/credit-card.model"));
class AccountStatusController {
    constructor() {
        this.getMonthlyStatus = async (req, res) => {
            var _a;
            try {
                const { month, year, credit_card_id } = req.query;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
                const status = await this.accountStatusService.getMonthlyStatus(Number(month), Number(year), userId, Number(credit_card_id));
                res.json(status);
            }
            catch (error) {
                console.error('Error in getMonthlyStatus:', error);
                res.status(500).json({
                    message: 'Error al obtener el estado de cuenta',
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
        };
        this.accountStatusService = account_status_service_1.AccountStatusService.getInstance();
    }
    static getInstance() {
        if (!AccountStatusController.instance) {
            AccountStatusController.instance = new AccountStatusController();
        }
        return AccountStatusController.instance;
    }
    async getMontoPorVencer(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const creditCards = await credit_card_model_1.default.findAll({
                where: { user_id: userId, is_active: true },
            });
            let gastosPorVencer = [];
            let montoPorVencer = 0;
            for (const card of creditCards) {
                if (!card.payment_due_date)
                    continue;
                const fechaLimite = new Date(card.payment_due_date);
                const desde = new Date(fechaLimite);
                desde.setDate(fechaLimite.getDate() - 7);
                const gastos = await expense_model_1.default.findAll({
                    where: {
                        user_id: userId,
                        credit_card_id: card.id,
                        date: { [sequelize_1.Op.between]: [desde, fechaLimite] }
                    }
                });
                gastosPorVencer = gastosPorVencer.concat(gastos.map(g => ({ ...g.toJSON(), payment_due_date: card.payment_due_date })));
                montoPorVencer += gastos.reduce((sum, exp) => sum + exp.amount, 0);
            }
            res.json({ montoPorVencer, gastos: gastosPorVencer });
        }
        catch (error) {
            res.status(500).json({ message: 'Error al obtener monto por vencer' });
        }
    }
}
exports.AccountStatusController = AccountStatusController;
class UserController {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async registerAdditionalUser(req, res) {
        try {
            const parentUser = req.user;
            if (!parentUser || !parentUser.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            const { name, email, password, role_id } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Faltan campos obligatorios' });
            }
            if (parentUser.parent_user_id) {
                return res.status(403).json({ message: 'Solo el usuario principal puede crear usuarios adicionales' });
            }
            const userData = {
                name,
                email,
                password_hash: password,
                role_id: role_id || 2,
                parent_user_id: parentUser.id,
            };
            const newUser = await this.userRepository.createAdditionalUser(userData);
            return res.status(201).json({ user: newUser });
        }
        catch (error) {
            return res.status(400).json({ message: error.message || 'Error registrando usuario adicional' });
        }
    }
    async getAdditionalUsers(req, res) {
        try {
            const parentUser = req.user;
            if (!parentUser || !parentUser.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            const users = await this.userRepository.findAdditionalUsers(parentUser.id);
            return res.json({ users });
        }
        catch (error) {
            return res.status(400).json({ message: error.message || 'Error obteniendo usuarios adicionales' });
        }
    }
    async deleteAdditionalUser(req, res) {
        try {
            const parentUser = req.user;
            if (!parentUser || !parentUser.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
            const { id } = req.params;
            const users = await this.userRepository.findAdditionalUsers(parentUser.id);
            const userToDelete = users.find(u => u.id === Number(id));
            if (!userToDelete) {
                return res.status(404).json({ message: 'Usuario adicional no encontrado' });
            }
            await userToDelete.destroy();
            return res.json({ message: 'Usuario adicional eliminado' });
        }
        catch (error) {
            return res.status(400).json({ message: error.message || 'Error eliminando usuario adicional' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=account-status.controller.js.map