'use strict';

const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, get a valid user ID (you'll need to adjust this based on your users)
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const userId = users.length > 0 ? users[0].id : '7d63690a-b9fc-4301-b992-e92b0f9f9d23'; // Fallback ID

    const products = [
      {
        productId: uuidv4(),
        name: 'Samsung Galaxy S24',
        description: 'Latest smartphone from Samsung with advanced features',
        price: 999.99,
        stock: 50,
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        productSubCatId: '444e02db-09a0-454a-8dfa-c964656518c7', // Smartphones
        userId: 'a8f0c00c-9407-42ce-be20-2646b933d89e',
        rating: 4.5,
        variation: JSON.stringify({ 
          colors: ['Black', 'White', 'Purple'],
          storage: ['128GB', '256GB', '512GB']
        }),
        image: [
          'https://example.com/samsung-s24-1.jpg',
          'https://example.com/samsung-s24-2.jpg'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId:uuidv4(),
        name: 'iPhone 15 Pro',
        description: 'Apple\'s flagship smartphone with titanium design',
        price: 1199.99,
        stock: 30,
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        productSubCatId: '444e02db-09a0-454a-8dfa-c964656518c7', // Smartphones
        userId: 'a8f0c00c-9407-42ce-be20-2646b933d89e',
        rating: 4.8,
        variation: JSON.stringify({ 
          colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium'],
          storage: ['128GB', '256GB', '512GB', '1TB']
        }),
        image: [
          'https://example.com/iphone-15-pro-1.jpg',
          'https://example.com/iphone-15-pro-2.jpg'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId:uuidv4(),
        name: 'MacBook Pro 16"',
        description: 'Professional laptop with M3 chip for power users',
        price: 2499.99,
        stock: 15,
        productCatId: 'c9b1f3e2-6d4a-4f3e-9b1a-2f1e3d4c5a6b', // Electronics
        productSubCatId: '555f03ec-1ab1-565b-afeb-d975757629d8', // Laptops
        userId: 'ba7423e9-9efe-4cbd-a135-fbf7d17c2c3c',
        rating: 4.7,
        variation: JSON.stringify({ 
          colors: ['Space Gray', 'Silver'],
          memory: ['18GB', '36GB'],
          storage: ['512GB', '1TB', '2TB']
        }),
        image: [
          'https://example.com/macbook-pro-1.jpg',
          'https://example.com/macbook-pro-2.jpg'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
     
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
