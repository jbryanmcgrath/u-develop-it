const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

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

// //GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//CREATE a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
VALUES (?,?,?,?)`;

const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, results) => {
    if (err) {
        console.log(err);
    }
    console.log(results);
});

//show all candidates in the table in the terminal
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

//second to last - catchall route
app.use((req, res) => {
    res.status(404).end();
});

//last
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

