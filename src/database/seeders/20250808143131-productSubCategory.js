'use strict';

const { v4: uuidv4 } = require("uuid");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const subCategories = [
      // Electronics subcategories
      {
        productSubCatId: uuidv4(), // Smartphones
        name: 'Smartphones',
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productSubCatId: uuidv4(),
        name: 'Laptops',
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productSubCatId: uuidv4(),
        name: 'Tablets',
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Clothing subcategories
      {
        productSubCatId: uuidv4(),
        name: 'Men\'s Clothing',
        productCatId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Clothing
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productSubCatId: uuidv4(),
        name: 'Women\'s Clothing',
        productCatId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Clothing
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Books subcategories
      {
        productSubCatId: uuidv4(),
        name: 'Fiction',
        productCatId: 'f5e4d3c2-b1a0-9876-5432-1098765432ab', // Books
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productSubCatId: uuidv4(),
        name: 'Technical',
        productCatId: 'f5e4d3c2-b1a0-9876-5432-1098765432ab', // Books
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
      // Home & Garden subcategories
      {
        productSubCatId: uuidv4(),
        name: 'Furniture',
        productCatId: '12345678-90ab-cdef-1234-567890abcdef', // Home & Garden
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productSubCatId: uuidv4(),
        name: 'Garden Tools',
        productCatId: '12345678-90ab-cdef-1234-567890abcdef', // Home & Garden
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('product_sub_categories', subCategories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_sub_categories', null, {});
  }
};
