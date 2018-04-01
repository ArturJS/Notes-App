import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/db-config')[env];

const db = {};
const sequelize = new Sequelize(config);

const notIndexMJS = filename =>
    filename.indexOf('.') !== 0 &&
    filename !== basename &&
    filename.slice(-4) === '.mjs';

fs
    .readdirSync(__dirname)
    .filter(notIndexMJS)
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));

        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
