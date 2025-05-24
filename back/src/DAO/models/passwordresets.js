'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordResets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PasswordResets.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "Usuario"
      });
  
    }
  }
  PasswordResets.init({
    usuarioId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PasswordResets',
    freezeTableName: true,
    timestamps: false
  });
  return PasswordResets;
};