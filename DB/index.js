const { LowSync, JSONFileSync } = require('lowdb');
// import { LowSync, JSONFileSync } from 'lowdb';

const path = require('path');

const file = path.join(__dirname, 'db.json');
const db = new LowSync(new JSONFileSync(file));

db.read();
db.data = db.data || {
  aliases: [], template: null, datasheet: null, indexes: { header: '', first: '', last: '' },
};

module.exports = db;
