// ===== SEED FILE 1: 01-product-categories.js =====
'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('product_categories', [
      {
        productCatId: '11111111-1111-1111-1111-111111111111',
        name: 'Electronics',
        description: 'Devices, gadgets and accessories'
      },
      {
        productCatId: '22222222-2222-2222-2222-222222222222',
        name: 'Clothing',
        description: 'Apparel for men, women, and children'
      },
      {
        productCatId: '33333333-3333-3333-3333-333333333333',
        name: 'Home & Kitchen',
        description: 'Household items and kitchen appliances'
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};