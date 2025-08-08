'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_sub_categories', {
      productSubCatId: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productCatId: {
        type: Sequelize.UUID,
        allowNull: false,
        // optionally you can add foreign key constraint here
        references: {
          model: 'product_categories', // name of the referenced table
          key: 'productCatId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_sub_categories');
  },
};
