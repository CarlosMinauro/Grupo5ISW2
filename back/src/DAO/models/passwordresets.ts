import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

interface PasswordResetAttributes {
    id: number;
    user_id: number;
    token: string;
    expires_at: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface PasswordResetCreationAttributes extends Omit<PasswordResetAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export default (sequelize: Sequelize): ModelStatic<Model<PasswordResetAttributes, PasswordResetCreationAttributes>> => {
    class PasswordResets extends Model<PasswordResetAttributes, PasswordResetCreationAttributes> implements PasswordResetAttributes {
        public id!: number;
        public user_id!: number;
        public token!: string;
        public expires_at!: Date;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    PasswordResets.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            tableName: 'password_resets',
            modelName: 'PasswordResets',
            timestamps: true,
        }
    );

    return PasswordResets;
}; 