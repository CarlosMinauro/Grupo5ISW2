import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

interface CategoryAttributes {
    id: number;
    name: string;
}

interface CategoryCreationAttributes extends Omit<CategoryAttributes, 'id'> {}

export default (sequelize: Sequelize): ModelStatic<Model<CategoryAttributes, CategoryCreationAttributes>> => {
    class Categories extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
        public id!: number;
        public name!: string;
    }

    Categories.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: 'Categories',
            modelName: 'Categories',
            timestamps: false,
        }
    );

    return Categories;
}; 