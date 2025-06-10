"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    async register(userData) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(userData.password_hash, salt);
        return this.userRepository.create({
            ...userData,
            password_hash: hashedPassword,
        });
    }
    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user);
        return {
            user,
            token,
        };
    }
    generateToken(user) {
        const secret = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
        const payload = {
            id: user.id,
            email: user.email,
            role_id: user.role_id,
        };
        const options = {
            expiresIn: '24h',
        };
        return jsonwebtoken_1.default.sign(payload, secret, options);
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');
            const user = await this.userRepository.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map