const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  port:3307,        // MySQL password
  database: 'student_db'
});

db.connect(err => {
  if(err) throw err;
  console.log('Database connected!');
});

// Routes

// Home page: show all students
app.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if(err) throw err;
    res.render('index', { students: results });
  });
});

// Add student form submission
app.post('/add', (req, res) => {
  const { name, dept, semester, last_gpa } = req.body;
  db.query(
    'INSERT INTO students (name, dept, semester, last_gpa) VALUES (?, ?, ?, ?)',
    [name, dept, semester, last_gpa],
    (err, result) => {
      if(err) throw err;
      res.redirect('/');
    }
  );
});

// Edit student info
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name, dept, semester, last_gpa } = req.body;

  const sql = "UPDATE students SET name=?, dept=?, semester=?, last_gpa=? WHERE id=?";
  db.query(sql, [name, dept, semester, last_gpa, id], (err) => {
    if (err) throw err;
    res.redirect("/"); // আপডেট শেষে আবার হোমপেজে রিডিরেক্ট
  });
});

// Delete student
app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM students WHERE id=?', [id], (err, result) => {
    if(err) throw err;
    res.redirect('/');
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
