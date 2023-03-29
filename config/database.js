const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;