// ===== SEED FILE 3: 03-product-sub-categories.js =====
'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('product_sub_categories', [
      {
        productSubCatId: uuidv4(),
        name: 'Smartphones',
        productCatId: '11111111-1111-1111-1111-111111111111', // Electronics category
      },
      {
        productSubCatId: uuidv4(),
        name: 'Laptops',
        productCatId: '11111111-1111-1111-1111-111111111111', // Electronics category
      },
      {
        productSubCatId: uuidv4(),
        name: 'Men\'s Shirts',
        productCatId: '22222222-2222-2222-2222-222222222222', // Clothing category
      },
      {
        productSubCatId: uuidv4(),
        name: 'Kitchen Appliances',
        productCatId: '33333333-3333-3333-3333-333333333333', // Home & Kitchen category
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_sub_categories', null, {});
  }
};
