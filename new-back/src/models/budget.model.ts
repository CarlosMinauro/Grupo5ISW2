import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IBudget } from '../interfaces/models';
import User from './user.model';
import Category from './category.model';

class Budget extends Model<IBudget> implements IBudget {
  public id!: number;
  public user_id!: number;
  public monthly_budget!: number;
  public category_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Budget.init(
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
    monthly_budget: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'Budgets',
    schema: 'public',
  }
);

export default Budget; 