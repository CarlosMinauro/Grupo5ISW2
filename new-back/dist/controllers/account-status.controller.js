"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusController = void 0;
const account_status_service_1 = require("../services/account-status.service");
class AccountStatusController {
    constructor() {
        this.getMonthlyStatus = async (req, res) => {
            var _a;
            try {
                const { month, year } = req.query;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'Usuario no autenticado' });
                    return;
                }
                if (!month || !year) {
                    res.status(400).json({ message: 'Mes y año son requeridos' });
                    return;
                }
                const status = await this.accountStatusService.getMonthlyStatus(Number(month), Number(year), userId);
                res.json(status);
            }
            catch (error) {
                console.error('Error in getMonthlyStatus:', error);
                res.status(500).json({
                    message: 'Error al obtener el estado de cuenta',
                    error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
}
exports.AccountStatusController = AccountStatusController;
//# sourceMappingURL=account-status.controller.js.map