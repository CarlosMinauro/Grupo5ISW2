import { Model, Optional, ModelStatic, Sequelize } from 'sequelize';

// Interfaz para el modelo Usuario
export interface UsuarioAttributes {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

export interface UsuarioInstance extends Model<UsuarioAttributes, UsuarioCreationAttributes>, UsuarioAttributes {
    Role?: RoleInstance;
}

// Interfaz para el modelo Role
export interface RoleAttributes {
    id: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

export interface RoleInstance extends Model<RoleAttributes, RoleCreationAttributes>, RoleAttributes {
    Usuarios?: UsuarioInstance[];
}

// Interfaz para el modelo Access_logs
export interface Access_logsAttributes {
    id: number;
    user_id: number;
    action: string;
    firstaccess: boolean;
    access_time?: Date;
}

export interface Access_logsCreationAttributes extends Optional<Access_logsAttributes, 'id'> {}

export interface Access_logsInstance extends Model<Access_logsAttributes, Access_logsCreationAttributes>, Access_logsAttributes {
    usuario?: UsuarioInstance; // Assuming an association exists
}

// Export the model instance types and Sequelize instance type
export { UsuarioInstance, RoleInstance, Access_logsInstance, Sequelize, ModelStatic }; 