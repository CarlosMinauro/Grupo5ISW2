'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Budgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      monthly_budget: {
        type: Sequelize.FLOAT
      },
      category_id: {
        type: Sequelize.INTEGER
      },
    });

    await queryInterface.addConstraint('Budgets', {
      name: "FK_BUDGETS_CATEGORY",
      type: "FOREIGN KEY",
      fields: ["category_id"],
      references: {
        table: "Categories",
        field: "id"
      },
    });

    await queryInterface.addConstraint('Budgets', {
      name: "FK_BUDGETS_USUARIO",
      type: "FOREIGN KEY",
      fields: ["user_id"],
      references: {
        table: "Usuario",
        field: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    })

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Budgets');
  }
};