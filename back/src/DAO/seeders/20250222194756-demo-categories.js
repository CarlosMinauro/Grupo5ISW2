'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [
     { name: 'Servicios' },
     { name: 'Alimentacion' },
     { name: 'Ocio' },
     { name: 'Comida' },
     { name: 'Transporte' },
     { name: 'Salud' },
     { name: 'Entretenimiento' },
     { name: 'Estudios' },
     { name: 'Regalos' }
    ], {});
   },

   down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  },
};
