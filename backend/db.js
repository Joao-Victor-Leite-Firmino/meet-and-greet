const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consultant TEXT,
    client TEXT,
    datetime TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consultant TEXT,
    client TEXT,
    description TEXT,
    amount REAL,
    status TEXT DEFAULT 'enviada' -- Adiciona a coluna de status
  )`);
});

module.exports = db;
