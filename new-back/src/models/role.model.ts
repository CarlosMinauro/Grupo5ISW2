import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IRole } from '../interfaces/models';

class Role extends Model<IRole> implements IRole {
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
    schema: 'public',
    timestamps: true,
  }
);

export default Role; 