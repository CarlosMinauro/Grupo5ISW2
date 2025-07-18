import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IUser } from '../interfaces/models';
import Role from './role.model';

class User extends Model<IUser> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role_id!: number;
  public parent_user_id?: number | null;
}

User.init(
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
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: 'id',
      },
    },
    parent_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuario',
        key: 'id',
      },
    },
  } as any,
  {
    sequelize,
    tableName: 'Usuario',
    schema: 'public',
    timestamps: false,
  }
);

export default User; 