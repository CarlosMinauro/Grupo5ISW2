'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasMany(models.PasswordResets, {
        foreignKey: "usuarioId",
        as: "PasswordResets"
      });

      Usuario.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "Role"
      });

      Usuario.hasMany(models.Expenses, {
        foreignKey: "user_id",
        as: "Expenses"
      });

      Usuario.hasMany(models.Budgets, {
        foreignKey: "user_id",
        as: "Budgets"
      });
      
      Usuario.hasMany(models.Access_logs, {
        foreignKey: "user_id",
        as: "Access_logs"
      });
    }
  }
  Usuario.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario',
    freezeTableName: true,
    timestamps: false,
  });
  return Usuario;
};