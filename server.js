const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck')

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//DATABASE connection
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username
        user: 'root',
        //Your MySQL password
        password: '',
        database: 'election'
    },
    console.log('Connected to the Database!')
);

// Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// //CREATE a candidate
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first-name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors })
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, results) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(results);
// });

//show all candidates in the table in the terminal
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
})

//second to last - catchall route
app.use((req, res) => {
    res.status(404).end();
});

//last
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

