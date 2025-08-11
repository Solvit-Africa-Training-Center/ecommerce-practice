'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if any roles already exist
    const usersExist= await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM users;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (usersExist[0].count > 0) {
      console.log('Users already seeded. Skipping...');
      return;
    }
  
    const users = [
      {
        id: "81ebc41c-6196-427c-8b71-68fc97069cf9",
        name: "Peter",
        email: "peter123@test.com",
        password:"$2b$10$xzvCF1Oz2vuTLauzTl7gm.FFpiQK4yMJh7sphnaYigjjewvcdXMZ.", // password
        roleId: "e70862b0-fd51-491d-bb54-a691cabf74de",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: "db754a82-5a7d-4a2d-9e0a-297cd985104a",
        name: "Paul",
        email: "paul123@test.com",
        password:"$2b$10$xzvCF1Oz2vuTLauzTl7gm.FFpiQK4yMJh7sphnaYigjjewvcdXMZ.", // password
        roleId: "5e84aec0-9a9b-4c0b-aecb-badf6b088c7d",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: "2a2096f6-a336-4cc4-bc95-717fc9c0b436",
        name: "Jane",
        email: "jane123@test.com",
        password:"$2b$10$xzvCF1Oz2vuTLauzTl7gm.FFpiQK4yMJh7sphnaYigjjewvcdXMZ.", // password
        roleId: "0d477982-0bb6-4bef-8c3c-d5e544497120",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      {
        id: "2c5aac8f-0712-4014-af95-7fed831b2753",
        name: "Janette",
        email: "janette123@test.com",
        password:"$2b$10$xzvCF1Oz2vuTLauzTl7gm.FFpiQK4yMJh7sphnaYigjjewvcdXMZ.", // password
        roleId: "0d477982-0bb6-4bef-8c3c-d5e544497120",
        updatedAt: new Date(),
        createdAt: new Date()
      },
      
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
