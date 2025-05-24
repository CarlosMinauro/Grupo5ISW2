import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
import { RoleAttributes, RoleCreationAttributes, RoleInstance } from '../../types/models';

export default (sequelize: Sequelize): ModelStatic<RoleInstance> => {
    class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
        public id!: number;
        public name!: string;
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    }

    Role.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            tableName: 'Role',
            modelName: 'Role',
            timestamps: false,
        }
    );

    return Role as ModelStatic<RoleInstance>;
}; 