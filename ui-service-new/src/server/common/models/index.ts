import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import getConfig from 'next/config';

const {
    serverRuntimeConfig: { 
        PROJECT_ROOT
    }
} = getConfig();
const basename = 'index.ts'
const env = process.env.NODE_ENV;
const dbConfig = require('../sequelize/db-config')[env];

const db = {};

if (env !== 'test' && !db.Sequelize) {
    initDB();
}

function initDB() {
    const sequelize = new Sequelize(dbConfig);
    const notIndexJs = filename =>
        filename !== basename &&
        path.extname(filename) === '.js';
    const modelsFolder = path.resolve(PROJECT_ROOT, 'src/server/common/models');

    fs
        .readdirSync(modelsFolder)
        .filter(notIndexJs)
        .forEach(file => {
            const model = sequelize.import(path.resolve(modelsFolder, file));

            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}

export default db;
