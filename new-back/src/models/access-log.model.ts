import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IAccessLog } from '../interfaces/models';
import User from './user.model';

class AccessLog extends Model<IAccessLog> implements IAccessLog {
  public id!: number;
  public user_id!: number;
  public access_time!: Date;
  public action!: string;
  public firstaccess!: boolean;
}

AccessLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    access_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstaccess: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'Access_logs',
    schema: 'public',
    timestamps: false,
  }
);

// Define associations
AccessLog.belongsTo(User, { foreignKey: 'user_id' });

export default AccessLog; 