'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable('statement', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
      },
      total: {
        type: Sequelize.DOUBLE(10, 2),
        allowNull: false,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      codUser: {
        type: Sequelize.STRING(50),
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      }

    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('statement')
  }
};
