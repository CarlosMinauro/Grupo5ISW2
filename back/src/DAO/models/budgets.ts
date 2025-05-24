import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';

interface BudgetAttributes {
    id: number;
    user_id: number;
    category_id: number;
    monthly_budget: number;
}

interface BudgetCreationAttributes extends Omit<BudgetAttributes, 'id'> {}

export default (sequelize: Sequelize): ModelStatic<Model<BudgetAttributes, BudgetCreationAttributes>> => {
    class Budgets extends Model<BudgetAttributes, BudgetCreationAttributes> implements BudgetAttributes {
        public id!: number;
        public user_id!: number;
        public category_id!: number;
        public monthly_budget!: number;
    }

    Budgets.init(
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
            monthly_budget: {
                type: DataTypes.FLOAT,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: 'Budgets',
            modelName: 'Budgets',
            timestamps: false,
        }
    );

    return Budgets;
}; 