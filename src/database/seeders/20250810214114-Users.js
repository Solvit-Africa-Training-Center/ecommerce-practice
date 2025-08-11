'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Retrieve existing roles
    const roles = await queryInterface.sequelize.query(`SELECT id, name FROM roles;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const getRoleId = (roleName) => {
      const role = roles.find((r) => r.name === roleName);
      if (!role) {
        throw new Error(`Role '${roleName}' not found. Make sure it is seeded before users.`);
      }
      return role.id;
    };

    const users = [
      {
        id: uuidv4(),
        name: 'Admin Admin',
        email: 'admin@admin.com',
        roleId: getRoleId('admin'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Bob Customer',
        email: 'bob@customer.com',
        roleId: getRoleId('customer'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Sally Seller',
        email: 'sally@seller.com',
        roleId: getRoleId('seller'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
