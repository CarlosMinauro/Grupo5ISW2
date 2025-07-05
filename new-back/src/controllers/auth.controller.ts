import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/models';
import { validationResult } from 'express-validator';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const userData: Partial<IUser> = {
        name: req.body.name,
        email: req.body.email,
        password_hash: req.body.password,
        role_id: req.body.role_id || 2, // Default to regular user role
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
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Error registering user',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(401).json({
        message: error.message || 'Invalid credentials',
      });
    }
  }
} 