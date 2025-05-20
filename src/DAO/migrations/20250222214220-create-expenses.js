'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },  
      amount: {
        type: Sequelize.FLOAT
      },
      description: {
        type: Sequelize.STRING
      },
      recurring: {
        type: Sequelize.BOOLEAN
      },
      category_id: {
        type: Sequelize.INTEGER
      }
    });

    await queryInterface.addConstraint('Expenses', {
      name: "FK_EXPENSES_CATEGORY",
      type: "FOREIGN KEY",
      fields: ["category_id"],
      references: {
        table: "Categories",
        field: "id"
      },
    });

    await queryInterface.addConstraint('Expenses', {
      name: "FK_EXPENSES_USUARIO",
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
    await queryInterface.dropTable('Expenses');
  }
};