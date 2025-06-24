const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./marketplace.db');

db.serialize(() => {
  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT,
    username TEXT,
    role TEXT,
    avatar TEXT
  )`);

  // Таблица товаров (мерч)
  db.run(`CREATE TABLE IF NOT EXISTS merch (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    influencer_id INTEGER,
    type TEXT,
    title TEXT,
    description TEXT,
    price INTEGER,
    photo TEXT,
    digital_link TEXT,
    available INTEGER DEFAULT 1
  )`);
});

// Таблица заказов
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merch_id INTEGER,
  buyer_name TEXT,
  buyer_contact TEXT,
  status TEXT,
  date TEXT,
  FOREIGN KEY (merch_id) REFERENCES merch(id)
)`);


// Добавим 2 тестовых товара, если база пустая
db.get('SELECT COUNT(*) as count FROM merch', (err, row) => {
  if (row.count === 0) {
    db.run(`INSERT INTO merch (influencer_id, type, title, description, price, photo, digital_link) VALUES
      (1, 'одежда', 'Футболка с логотипом', 'Белая футболка, 100% хлопок', 1999, '', ''),
      (1, 'цифра', 'PDF-гайд “Как стать инфлюенсером”', 'Авторский гайд', 499, '', '')
    `);
  }
});


module.exports = db;
