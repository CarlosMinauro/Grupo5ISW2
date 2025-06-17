import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Token inválido' });
      }

      (req as any).user = user;
      return next();
    });
    return;
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ message: 'Error en la autenticación' });
  }
};

export const roleMiddleware = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(user.role_id)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    return next();
  };
}; 