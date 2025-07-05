import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IPasswordReset } from '../interfaces/models';
import User from './user.model';

class PasswordReset extends Model<IPasswordReset> implements IPasswordReset {
  public id!: number;
  public usuarioId!: number;
  public token!: string;
  public created_at!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PasswordReset.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'PasswordResets',
    schema: 'public',
  }
);

export default PasswordReset; 