'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Expenses.belongsTo(models.Categories, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Expenses.belongsTo(models.Usuario, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Expenses.init({
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    amount: DataTypes.FLOAT,
    description: DataTypes.STRING,
    recurring: DataTypes.BOOLEAN,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expenses',
    freezeTableName: true,
    timestamps: false
  });
  return Expenses;
};