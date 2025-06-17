import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IExpense, ICategory } from '../interfaces/models';
import User from './user.model';
import Category from './category.model';
import CreditCard from './credit-card.model';

class Expense extends Model<IExpense> implements IExpense {
  public id!: number;
  public user_id!: number;
  public date!: Date;
  public amount!: number;
  public description!: string;
  public recurring!: boolean;
  public category_id!: number | null;
  public credit_card_id?: number | null;
  public transaction_type!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public Category?: ICategory;
}

Expense.init(
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Category,
        key: 'id',
      },
    },
    credit_card_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CreditCard,
        key: 'id',
      },
    },
    transaction_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'expense',
      validate: {
        isIn: [['expense', 'payment']],
      },
    },
  },
  {
    sequelize,
    tableName: 'Expenses',
    schema: 'public',
  }
);

// Define associations
Expense.belongsTo(User, { foreignKey: 'user_id' });
Expense.belongsTo(Category, { foreignKey: 'category_id' });
Expense.belongsTo(CreditCard, { foreignKey: 'credit_card_id' });

export default Expense; 