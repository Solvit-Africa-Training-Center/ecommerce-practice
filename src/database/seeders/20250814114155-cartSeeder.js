'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const existing = await queryInterface.sequelize.query(
      `SELECT COUNT(*) as count FROM carts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existing[0].count > 0) {
      console.log('Carts already seeded. Skipping...');
      return;
    }

    const carts = [
      {
        id: '94b3a667-defd-425a-8d94-639a9e86781a',
        userId: 'acc284e1-c124-4c56-80c3-259d18768d0b', // Bob Customer for seller sellay
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        id: '94b3a667-defd-425a-8d94-639a9e86781b',
        userId: 'acc284e1-c124-4c56-80c3-259d18768d0c', // lily customer for seller Rwanda
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '94b3a667-defd-425a-8d94-639a9e86781c',
        userId: 'acc284e1-c124-4c56-80c3-259d18768d0b', // Bob Customer for seller sellay
        createdAt: new Date(),
        updatedAt: new Date(),
      },
          {
        id: '94b3a667-defd-425a-8d94-639a9e86781d',
        userId: 'acc284e1-c124-4c56-80c3-259d18768d0b', // Bob Customer for seller sellay
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('carts', carts, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carts', null, {});
  },
};
