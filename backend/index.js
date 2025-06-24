const express = require('express');
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/order', (req, res) => {
  const { merch_id, buyer_name, buyer_contact } = req.body;
  const status = 'создан';
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO orders (merch_id, buyer_name, buyer_contact, status, date) VALUES (?, ?, ?, ?, ?)`,
    [merch_id, buyer_name, buyer_contact, status, date],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ order_id: this.lastID, status });
    }
  );
});

app.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

app.get('/merch', (req, res) => {
  db.all('SELECT * FROM merch WHERE available=1', (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
