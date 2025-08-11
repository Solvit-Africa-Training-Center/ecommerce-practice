'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      ratingId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'productId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ratings: {
        type: Sequelize.INTEGER,
        allowNull:false,
        validate:{
          min:1,
          max:5,
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('ratings', ['productId']);
    await queryInterface.addIndex('ratings', ['userId']);
    await queryInterface.addIndex('ratings', ['productId', 'userId'], {
      unique: true, 
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ratings');
  }
};