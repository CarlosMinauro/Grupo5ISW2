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
    }
  },
  {
    sequelize,
    tableName: 'Usuario',
    schema: 'public',
    timestamps: false,
  }
);

// Define associations
User.belongsTo(Role, { foreignKey: 'role_id' });

export default User; 