import { Sequelize } from "sequelize";
require('dotenv/config')

const database = process.env.DB_DATA_BASE
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const dialect = 'mysql'

export const connection = new Sequelize(database!, username!, password, {
    host,
    dialect
})