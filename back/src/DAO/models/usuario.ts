import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import { UsuarioAttributes, UsuarioCreationAttributes, UsuarioInstance } from '../../types/models';

export default (sequelize: Sequelize): ModelStatic<UsuarioInstance> => {
    class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
        public id!: number;
        public name!: string;
        public email!: string;
        public password_hash!: string;
        public role_id!: number;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    Usuario.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'Usuario',
            modelName: 'Usuario',
            timestamps: false,
        }
    );

    return Usuario as ModelStatic<UsuarioInstance>;
}; 