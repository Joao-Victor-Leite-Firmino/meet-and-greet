const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path');
const db = require('./db');
const excel = require('exceljs'); // Para manipulação de Excel

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve arquivos estáticos

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html')); // Certifique-se de que o caminho está correto
});

// Rota para obter reuniões
app.get('/api/meetings', (req, res) => {
    db.all("SELECT * FROM meetings", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para adicionar uma nova reunião
app.post('/api/meetings', (req, res) => {
    const { consultant, client, datetime } = req.body;
    db.run("INSERT INTO meetings (consultant, client, datetime) VALUES (?, ?, ?)",
        [consultant, client, datetime],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, consultant, client, datetime });
        });
});

// Rota para excluir uma reunião
app.delete('/api/meetings/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM meetings WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Reunião excluída com sucesso' });
    });
});

// Rota para obter propostas
app.get('/api/proposals', (req, res) => {
    db.all("SELECT * FROM proposals", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para adicionar uma nova proposta
app.post('/api/proposals', (req, res) => {
    const { consultant, client, description, amount } = req.body;
    db.run("INSERT INTO proposals (consultant, client, description, amount) VALUES (?, ?, ?, ?)",
        [consultant, client, description, amount],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, consultant, client, description, amount, status: 'enviada' });
        });
});

// Rota para atualizar o status da proposta
app.put('/api/proposals/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    db.run("UPDATE proposals SET status = ? WHERE id = ?", [status, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, status });
    });
});

// Rota para excluir uma proposta
app.delete('/api/proposals/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM proposals WHERE id = ?", id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Proposta excluída com sucesso' });
    });
});

// Rota para baixar propostas em Excel filtradas por consultor
app.get('/api/proposals/download', async (req, res) => {
    const { consultant } = req.query; // Obtém o consultor da query string
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Propostas');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Consultor', key: 'consultant', width: 30 },
        { header: 'Cliente', key: 'client', width: 30 },
        { header: 'Descrição', key: 'description', width: 50 },
        { header: 'Valor', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 }
    ];

    db.all("SELECT * FROM proposals WHERE consultant = ?", [consultant], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        rows.forEach(row => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=propostas.xlsx');
        workbook.xlsx.write(res).then(() => {
            res.end();
        });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
