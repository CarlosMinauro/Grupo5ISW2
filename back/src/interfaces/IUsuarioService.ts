import { UsuarioInstance, UsuarioAttributes } from '../types/models';

/**
 * Interfaz que define los métodos del servicio de usuarios
 * Siguiendo el principio de Segregación de Interfaces (ISP),
 * esta interfaz define solo los métodos necesarios para la lógica de negocio de usuarios
 */
export interface IUsuarioService {
    getAllUsers(): Promise<UsuarioInstance[]>;
    getUserById(id: number): Promise<UsuarioInstance | null>;
    getUsersByRole(roleId: number): Promise<UsuarioInstance[]>;
    createUser(usuario: Partial<UsuarioAttributes>): Promise<UsuarioInstance>;
    updateUser(id: number, usuario: Partial<UsuarioAttributes>): Promise<[number]>;
    deleteUser(id: number): Promise<number>;
    verifyToken(token: string): Promise<any>;
} 