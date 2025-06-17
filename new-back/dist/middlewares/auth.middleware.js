"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Token no proporcionado' });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
            if (err) {
                console.error('Token verification error:', err);
                return res.status(403).json({ message: 'Token inválido' });
            }
            req.user = user;
            return next();
        });
        return;
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ message: 'Error en la autenticación' });
    }
};
exports.authenticateToken = authenticateToken;
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!roles.includes(user.role_id)) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        return next();
    };
};
exports.roleMiddleware = roleMiddleware;
//# sourceMappingURL=auth.middleware.js.map