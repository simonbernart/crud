const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cadastro'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.get('/pessoas', (req, res) => {
    let sql = 'SELECT * FROM pessoas';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/pessoas', (req, res) => {
    let sql = 'INSERT INTO pessoas SET ?';
    let newPessoa = {
        nome: req.body.nome,
        email: req.body.email
    };
    db.query(sql, newPessoa, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newPessoa });
    });
});

app.put('/pessoas/:id', (req, res) => {
    let sql = `UPDATE pessoas SET nome = ?, email = ? WHERE id = ?`;
    let updatePessoa = [req.body.nome, req.body.email, req.params.id];
    db.query(sql, updatePessoa, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.delete('/pessoas/:id', (req, res) => {
    let sql = `DELETE FROM pessoas WHERE id = ?`;
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
