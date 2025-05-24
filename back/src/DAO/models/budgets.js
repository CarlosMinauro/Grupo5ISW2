'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budgets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budgets.belongsTo(models.Categories, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Budgets.belongsTo(models.Usuario, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Budgets.init({
    user_id: DataTypes.INTEGER,
    monthly_budget: DataTypes.FLOAT,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Budgets',
    freezeTableName: true,
    timestamps: false
  });
  return Budgets;
};