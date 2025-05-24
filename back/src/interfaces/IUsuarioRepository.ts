import { UsuarioInstance, UsuarioAttributes, UsuarioCreationAttributes } from '../types/models';

/**
 * Interfaz que define los métodos del repositorio de usuarios
 * Siguiendo el principio de Segregación de Interfaces (ISP),
 * esta interfaz define solo los métodos necesarios para el manejo de usuarios
 */
export interface IUsuarioRepository {
    findAll(): Promise<UsuarioInstance[]>;
    findById(id: number): Promise<UsuarioInstance | null>;
    findByRoleId(roleId: number): Promise<UsuarioInstance[]>;
    create(usuario: Partial<UsuarioAttributes>): Promise<UsuarioInstance>;
    update(id: number, usuario: Partial<UsuarioAttributes>): Promise<[number]>;
    delete(id: number): Promise<number>;
} 