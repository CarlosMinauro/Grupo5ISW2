import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

export class UserController {
  // ...existing code...
  public async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { name, email, password } = req.body;
      console.log('updateProfile called:', { userId, name, email });
      const user = await User.findByPk(userId);
      if (!user) {
        console.error('Usuario no encontrado para updateProfile:', userId);
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      // Validación: no permitir campos vacíos
      if (name !== undefined && !name.trim()) {
        return res.status(400).json({ message: 'El nombre no puede estar vacío' });
      }
      if (email !== undefined && !email.trim()) {
        return res.status(400).json({ message: 'El email no puede estar vacío' });
      }
      // Solo actualiza si se envía un valor no vacío
      if (name && name.trim()) user.name = name;
      if (email && email.trim()) user.email = email;
      if (password && password.trim()) user.password_hash = await bcrypt.hash(password, 10);
      await user.save();
      console.log('Perfil actualizado correctamente:', user.toJSON());
      return res.json({ user });
    } catch (error) {
      console.error('Error en updateProfile:', error);
      return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
  }
  // ...existing code...
} 