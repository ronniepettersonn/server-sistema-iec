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

    await queryInterface.createTable('members', {
      id: {
        type: Sequelize.STRING(50),
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tel: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(14),
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        primaryKey: true,
        unique: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address_number: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address_complement: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      date_born: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      date_member: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      neighborhood: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      city: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cep: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      uf: {
        type: Sequelize.STRING(2),
        allowNull: false
      },
      gender: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      marital: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      isMember: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }

    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('members')
  }
};
