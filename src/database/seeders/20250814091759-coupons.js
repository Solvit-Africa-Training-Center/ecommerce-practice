'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('coupons', [
      {
        code: 'WELCOME10',
        discount: 10,
        isActive: true,
        expiredDate: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'SUMMER20',
        discount: 20,
        isActive: true,
        expiredDate: new Date('2025-08-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'FREESHIP',
        discount: 5,
        isActive: true,
        expiredDate: new Date('2025-09-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {
      ignoreDuplicates: true, // optional: skip duplicate codes
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('coupons', {
      code: ['WELCOME10', 'SUMMER20', 'FREESHIP'],
    });
  },
};
