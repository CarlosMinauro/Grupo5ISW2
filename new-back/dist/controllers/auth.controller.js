"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const express_validator_1 = require("express-validator");
class AuthController {
    constructor() {
        this.authService = new auth_service_1.AuthService();
    }
    async register(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const userData = {
                name: req.body.name,
                email: req.body.email,
                password_hash: req.body.password,
                role_id: req.body.role_id || 2,
            };
            const user = await this.authService.register(userData);
            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id,
                },
            });
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Error registering user',
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json({
                message: 'Login successful',
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role_id: result.user.role_id,
                },
                token: result.token,
            });
        }
        catch (error) {
            res.status(401).json({
                message: error.message || 'Invalid credentials',
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map