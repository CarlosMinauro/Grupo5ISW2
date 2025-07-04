import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ICreditCard } from '../interfaces/models';
import User from './user.model';

class CreditCard extends Model<ICreditCard> implements ICreditCard {
  public id!: number;
  public user_id!: number;
  public card_number!: string;
  public card_holder_name!: string;
  public expiration_date?: Date | null;
  public brand!: string;
  public bank!: string;
  public is_active!: boolean;
  public created_at!: Date;
  public cut_off_date?: Date | null;
  public payment_due_date?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CreditCard.init(
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
    card_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    card_holder_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bank: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    cut_off_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'CreditCards',
    schema: 'public',
  }
);

export default CreditCard; 