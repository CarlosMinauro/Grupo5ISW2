import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ICategory } from '../interfaces/models';

class Category extends Model<ICategory> implements ICategory {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
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
    tableName: 'Categories',
    schema: 'public',
  }
);

export default Category; 