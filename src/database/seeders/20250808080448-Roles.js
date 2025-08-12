'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if any roles already exist
    const roles = await queryInterface.sequelize.query(`SELECT COUNT(*) as count FROM roles;`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (roles[0].count > 0) {
      console.log('Roles already seeded. Skipping...');
      return;
    }

    const now = new Date();

    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        name: 'admin',
        description: 'Platform administrator with full access',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'customer',
        description: 'Regular shopper with access to browse and purchase',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'seller',
        description: 'Vendor with permission to manage their products and orders',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'moderator',
        description: 'Can review and approve content or products',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'support_agent',
        description: 'Handles customer queries and support tickets',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'logistics_manager',
        description: 'Manages shipping and delivery operations',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'finance_manager',
        description: 'Oversees transactions and financial reporting',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'inventory_specialist',
        description: 'Maintains stock levels and product availability',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'marketing_specialist',
        description: 'Plans and executes marketing campaigns',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'qa_tester',
        description: 'Tests platform features for bugs and quality issues',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'developer',
        description: 'Writes and maintains application code',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'security_officer',
        description: 'Ensures security of the platform and user data',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'guest',
        description: 'Unauthenticated user with minimal access',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'premium_customer',
        description: 'Paying customer with special perks and discounts',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'content_creator',
        description: 'Uploads and manages digital content',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'analyst',
        description: 'Reviews performance metrics and generates reports',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'partner',
        description: 'External business partner with specific access',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'auditor',
        description: 'Reviews and verifies financial or operational processes',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'trainer',
        description: 'Provides training for staff or customers',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'beta_tester',
        description: 'Tests pre-release features and provides feedback',
        createdAt: now,
        updatedAt: now,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
