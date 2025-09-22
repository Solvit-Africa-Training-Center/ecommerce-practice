'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const carts = await queryInterface.sequelize.query(
      `SELECT id FROM carts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      `SELECT  price, name FROM products ORDER BY name;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!carts.length || !products.length) {
      throw new Error('No carts or products found. Please seed them first.');
    }

    const cartItems = [];

    // Assign fixed products for each cart
    // Bob gets first two products
    cartItems.push({
      id: uuidv4(),
      cartId: carts[0].id,
      productId: '6f258de1-2138-405a-9a4c-ff7ea7cbc3b0', // samsung 
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    cartItems.push({
      id: uuidv4(),
      cartId: carts[0].id,
      productId: 'b795e83e-738a-4fee-a6ae-5887ec4aea83', // iphone 15
      quantity: 1,
      price: products[1].price,
      totalprice: parseFloat((products[1].price * 1).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      cartItems.push({
      id: uuidv4(),
      cartId: carts[1].id,
      productId: 'b2acdd3b-1807-4772-8a4c-82614ea283a7', // complete jacket
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      cartItems.push({
      id: uuidv4(),
      cartId: carts[1].id,
      productId: 'a7e481fc-e04e-4c56-93d4-f890b20681c1', // catton T-shirt
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

        cartItems.push({
      id: uuidv4(),
      cartId: carts[2].id,
      productId: '6f258de1-2138-405a-9a4c-ff7ea7cbc3b0', // samsang
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      cartItems.push({
      id: uuidv4(),
      cartId: carts[2].id,
      productId: 'b795e83e-738a-4fee-a6ae-5887ec4aea83', //i phone pro 15
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      cartItems.push({
      id: uuidv4(),
      cartId: carts[2].id,
      productId: '665cb50f-d015-4d73-937f-2be9cc0b096f', // mac book 16
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });


      cartItems.push({
      id: uuidv4(),
      cartId: carts[3].id,
      productId: 'b795e83e-738a-4fee-a6ae-5887ec4aea83', //i phone pro 15
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

      cartItems.push({
      id: uuidv4(),
      cartId: carts[3].id,
      productId: 'b2acdd3b-1807-4772-8a4c-82614ea283a7', // complete jacket
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Sally gets third and fourth products
   

    await queryInterface.bulkInsert('cart_items', cartItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('cart_items', null, {});
  },
};
