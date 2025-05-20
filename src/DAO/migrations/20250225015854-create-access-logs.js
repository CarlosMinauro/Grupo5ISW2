'use strict';

const { on } = require('events');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Access_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      access_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      action: {
        type: Sequelize.STRING
      },
      firstaccess: {
        type: Sequelize.BOOLEAN
      }
    });

    await queryInterface.addConstraint('Access_logs', {
      name: "FK_ACCESS_LOGS_USUARIO",
      type: "FOREIGN KEY",
      fields: ["user_id"],
      references: {
        table: "Usuario",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Access_logs');
  }
};