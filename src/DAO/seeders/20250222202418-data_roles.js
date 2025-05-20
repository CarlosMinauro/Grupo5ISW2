'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Role', [
  
     {
      name: 'Admin'
     },
  
     {
      name: 'User'
     }
  
    ], {});
  
   },

   async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Role', null, {});
  }
  
};
