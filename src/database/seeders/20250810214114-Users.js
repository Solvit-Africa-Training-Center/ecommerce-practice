'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {

    const user = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM users;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (user[0].count > 0) {
      console.log('Users already seeded. Skipping...');
      return;
    }

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
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Bob Customer',
        email: 'bob@customer.com',
        roleId: getRoleId('customer'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Sally Seller',
        email: 'sally@seller.com',
        roleId: getRoleId('seller'),
        password: '$2b$12$/Hm2jpfZ.RIDPAzfUFDbmeTNVoRzAifnK2PVrWN4nV7A0nesQqQWq',
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
