'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Access_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Access_logs.belongsTo(models.Usuario, {
        foreignKey: 'user_id',
        as: 'usuario'
      });
    }
  }
  Access_logs.init({
    user_id: DataTypes.INTEGER,
    access_time: DataTypes.DATE,
    action: DataTypes.STRING,
    firstaccess: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Access_logs',
    freezeTableName: true,
    timestamps: false
  });
  return Access_logs;
};