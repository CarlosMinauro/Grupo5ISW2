"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const account_status_routes_1 = __importDefault(require("./routes/account-status.routes"));
const credit_card_routes_1 = __importDefault(require("./routes/credit-card.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const database_1 = __importDefault(require("./config/database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/expenses', expense_routes_1.default);
app.use('/api/budgets', budget_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/account-status', account_status_routes_1.default);
app.use('/api/cards', credit_card_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
const PORT = process.env.PORT || 3001;
async function startServer() {
    try {
        await database_1.default.authenticate();
        console.log('Database connection has been established successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Registered routes:');
            app._router.stack.forEach((r) => {
                if (r.route && r.route.path) {
                    console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
                }
            });
        });
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
startServer();
//# sourceMappingURL=app.js.map