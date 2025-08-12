'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    // Fetch role IDs dynamically by role name
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('admin', 'seller', 'customer')`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    // Generate 20 users with different roles and emails
    const users = [];

    // 5 admins
    for (let i = 1; i <= 5; i++) {
      users.push({
        id: uuidv4(),
        name: `Admin User ${i}`,
        email: `admin${i}@example.com`,
        password: hashedPassword,
        roleId: roleMap['admin'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 7 sellers
    for (let i = 1; i <= 7; i++) {
      users.push({
        id: uuidv4(),
        name: `Seller User ${i}`,
        email: `seller${i}@example.com`,
        password: hashedPassword,
        roleId: roleMap['seller'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 8 customers
    for (let i = 1; i <= 8; i++) {
      users.push({
        id: uuidv4(),
        name: `Customer User ${i}`,
        email: `customer${i}@example.com`,
        password: hashedPassword,
        roleId: roleMap['customer'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface, Sequelize) {
    // Delete seeded users by matching emails
    const emails = [];
    for (let i = 1; i <= 5; i++) emails.push(`admin${i}@example.com`);
    for (let i = 1; i <= 7; i++) emails.push(`seller${i}@example.com`);
    for (let i = 1; i <= 8; i++) emails.push(`customer${i}@example.com`);

    return queryInterface.bulkDelete('users', { email: emails });
  },
};
