import { Usuario } from '../DAO/models';
import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
import { UsuarioInstance, UsuarioAttributes, UsuarioCreationAttributes } from '../types/models';

/**
 * Implementación del repositorio de usuarios
 * Siguiendo el principio de Inversión de Dependencias (DIP),
 * esta clase implementa la interfaz IUsuarioRepository
 */
export class UsuarioRepository implements IUsuarioRepository {
    async findAll(): Promise<UsuarioInstance[]> {
        return await Usuario.findAll();
    }

    async findById(id: number): Promise<UsuarioInstance | null> {
        return await Usuario.findByPk(id);
    }

    async findByEmail(email: string): Promise<UsuarioInstance | null> {
        return await Usuario.findOne({ where: { email } });
    }

    async findByRoleId(roleId: number): Promise<UsuarioInstance[]> {
        return await Usuario.findAll({
            where: { role_id: roleId },
            include: [{
                model: Usuario.associations.Role.target,
                as: "Role",
                attributes: ["name"],
                required: true
            }],
            order: [["id", "ASC"]]
        });
    }

    async create(usuario: Partial<UsuarioAttributes>): Promise<UsuarioInstance> {
        const creationAttributes: UsuarioCreationAttributes = {
            name: usuario.name!,
            email: usuario.email!,
            password_hash: usuario.password_hash!,
            role_id: usuario.role_id!
        };
        return await Usuario.create(creationAttributes);
    }

    async update(id: number, usuario: Partial<UsuarioAttributes>): Promise<[number]> {
        return await Usuario.update(usuario, { where: { id } });
    }

    async delete(id: number): Promise<number> {
        return await Usuario.destroy({ where: { id } });
    }
} 