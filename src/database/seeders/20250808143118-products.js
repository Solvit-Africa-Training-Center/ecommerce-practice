// ===== SEED FILE 2: 02-products.js =====
'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        productId: uuidv4(),
        name: 'Example Product 1',
        description: 'This is the description for product 1',
        price: 29.99,
        stock: 100,
        productCatId: '11111111-1111-1111-1111-111111111111', // Electronics category
        rating: 4.5,
        variation: JSON.stringify({ color: 'red', size: 'M' }),
        image: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      },
      {
        productId: uuidv4(),
        name: 'Example Product 2',
        description: 'This is the description for product 2',
        price: 59.99,
        stock: 50,
        productCatId: '22222222-2222-2222-2222-222222222222', // Clothing category
        rating: 3.9,
        variation: JSON.stringify({ color: 'blue', size: 'L' }),
        image: ['https://example.com/image3.jpg']
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};