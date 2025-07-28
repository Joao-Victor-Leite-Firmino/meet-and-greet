const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Cria tabelas se não existirem
db.serialize(() => {
    // Tabela para reuniões
    db.run(`CREATE TABLE IF NOT EXISTS meetings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultant TEXT NOT NULL,
        client TEXT NOT NULL,
        datetime TEXT NOT NULL
    )`);

    // Tabela para propostas
    db.run(`CREATE TABLE IF NOT EXISTS proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consultant TEXT NOT NULL,
        client TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'enviada' -- Status padrão é 'enviada'
    )`);
});

// Exporta o banco de dados para uso em outras partes da aplicação
module.exports = db;
