'use strict';

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        productCatId: uuidv4(), // Electronics
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productCatId: uuidv4(), // Clothing
        name: 'Clothing',
        description: 'Fashion and apparel items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productCatId: uuidv4(), // Books
        name: 'Books',
        description: 'Books and educational materials',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productCatId: uuidv4(), // Home & Garden
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('product_categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  }
};

