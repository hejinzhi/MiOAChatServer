// import sequelize from '../lib/sequelize';
// import Sequelize from 'sequelize';
// import request from 'request-promise-native';

var sequelize = require('../lib/sequelize');
var Sequelize = require('sequelize');
var request = require('request-promise-native');

const message = sequelize.define('moa_messages', {
    ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TO_USER_NAME: {
        type: Sequelize.STRING,
    },
    FROM_USER_NAME: {
        type: Sequelize.STRING,
    },
    OWNER: {
        type: Sequelize.STRING,
    },
    CONTENT: {
        type: Sequelize.STRING,
    },
    CONTENT_TYPE: {
        type: Sequelize.STRING,
    },
    TIME: {
        type: Sequelize.STRING,
    },
    TYPE: {
        type: Sequelize.STRING,
    },
    UNREAD: {
        type: Sequelize.STRING,
    },
    EXTRA: {
        type: Sequelize.STRING,
    },
    CHILD_TYPE: {
        type: Sequelize.STRING,
    },
    IMAGE_HEIGHT: {
        type: Sequelize.INTEGER,
    },
    IMAGE_WIDTH: {
        type: Sequelize.INTEGER,
    },
    DURATION: {
        type: Sequelize.INTEGER,
    },
    VOUNREAD: {
        type: Sequelize.STRING,
    }
}, {
    freezeTableName: true,
    timestamps: true
})

let query = (sql) => {
    return sequelize.query(sql, {
        model: message
    });
};

async function addMessage(data) {
    let msg = data;
    let result = await message.create(msg);
    return result.dataValues;
};

async function getOutlineMessageByUsername(username) {
    let result = await query(`select * from moa_messages where TO_USER_NAME='${username}' and UNREAD='Y' order by TIME `);
    return result;
}

async function getAllOutlineMessages() {
    let result = await query(`select * from moa_messages where  UNREAD='Y' order by TIME `);
    return result;
}

async function updateMessage(id) {
    let result = await message.update({
        UNREAD: 'N'
    }, {
        where: {
            id: id
        }
    });
    return result;
}

module.exports = {
    addMessage,
    updateMessage,
    getOutlineMessageByUsername,
    getAllOutlineMessages
}