import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

interface ExpenseAttributes {
    id: number;
    user_id: number;
    category_id: number;
    amount: number;
    description: string;
    date: Date;
    recurring: boolean;
}

interface ExpenseCreationAttributes extends Omit<ExpenseAttributes, 'id'> {}

export default (sequelize: Sequelize): ModelStatic<Model<ExpenseAttributes, ExpenseCreationAttributes>> => {
    class Expenses extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
        public id!: number;
        public user_id!: number;
        public category_id!: number;
        public amount!: number;
        public description!: string;
        public date!: Date;
        public recurring!: boolean;
    }

    Expenses.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            recurring: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {
            sequelize,
            tableName: 'Expenses',
            modelName: 'Expenses',
            timestamps: false,
        }
    );

    return Expenses;
}; 