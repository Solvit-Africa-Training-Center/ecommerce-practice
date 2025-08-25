'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const carts = await queryInterface.sequelize.query(`SELECT id FROM carts;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const products = await queryInterface.sequelize.query(
      `SELECT  price, name FROM products ORDER BY name;`,
      { type: Sequelize.QueryTypes.SELECT },
    const carts = await queryInterface.sequelize.query(
      `SELECT id FROM carts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const products = await queryInterface.sequelize.query(
      `SELECT  price, name FROM products ORDER BY name;`,
      { type: Sequelize.QueryTypes.SELECT }
    const carts = await queryInterface.sequelize.query(`SELECT id FROM carts;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const products = await queryInterface.sequelize.query(
      `SELECT  price, name FROM products ORDER BY name;`,
      { type: Sequelize.QueryTypes.SELECT },
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
      productId: '6f258de1-2138-405a-9a4c-ff7ea7cbc3b0',
      quantity: 2,
      price: products[0].price,
      totalprice: parseFloat((products[0].price * 2).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    cartItems.push({
      id: uuidv4(),
      cartId: carts[0].id,
      productId: 'b795e83e-738a-4fee-a6ae-5887ec4aea83',
      quantity: 1,
      price: products[1].price,
      totalprice: parseFloat((products[1].price * 1).toFixed(2)),
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
