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

    await queryInterface.createTable('schedule', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      name_person: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      name_member: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_member: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      minister: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      dirigent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      date: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_id: {
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
    await queryInterface.dropTable('schedule');
  }
};
