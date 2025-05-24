import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUsuarioService } from '../interfaces/IUsuarioService';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { UsuarioInstance, UsuarioAttributes, UsuarioCreationAttributes } from '../types/models';

/**
 * Implementación del servicio de usuarios
 * Siguiendo el principio de Responsabilidad Única (SRP),
 * esta clase maneja toda la lógica de negocio relacionada con usuarios
 */
export class UsuarioService implements IUsuarioService {
    private repository: UsuarioRepository;

    constructor() {
        this.repository = new UsuarioRepository();
    }

    async getAllUsers(): Promise<UsuarioInstance[]> {
        return await this.repository.findAll();
    }

    async getUserById(id: number): Promise<UsuarioInstance | null> {
        return await this.repository.findById(id);
    }

    async getUsersByRole(roleId: number): Promise<UsuarioInstance[]> {
        return await this.repository.findByRoleId(roleId);
    }

    async createUser(usuario: Partial<UsuarioAttributes>): Promise<UsuarioInstance> {
        // Encriptar la contraseña antes de guardar
        if (usuario.password_hash) {
            usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
        }
        return await this.repository.create(usuario);
    }

    async updateUser(id: number, usuario: Partial<UsuarioAttributes>): Promise<[number]> {
        // Si se está actualizando la contraseña, encriptarla
        if (usuario.password_hash) {
            usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
        }
        return await this.repository.update(id, usuario);
    }

    async deleteUser(id: number): Promise<number> {
        return await this.repository.delete(id);
    }

    async verifyToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }
} 