// import Sequelize from 'sequelize'
// import {
//     DB as DBConfig
// } from '../config/default'

var Sequelize = require('sequelize');
var DBConfig = require('../config/default');

module.exports = sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
    host: DBConfig.host,
    dialect: 'mysql',
    dialectOptions: { // MySQL > 5.5，其它数据库删除此项
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_520_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool: {
        max: 50,
        min: 0,
        idle: 10000
    }
});