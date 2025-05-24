'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categories.hasMany(models.Expenses, {
        foreignKey: 'category_id',
        as: 'expenses'
      });

      Categories.hasMany(models.Budgets, {
        foreignKey: 'category_id',
        as: 'budgets'
      });
    }
  }
  Categories.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categories',
    freezeTableName: true,
    timestamps: false
  });
  return Categories;
};