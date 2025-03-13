const sqlite3 = require('sqlite3').verbose();

module.exports = {
  database: {
    filename: './gadget_inventory.db',
    driver: sqlite3
  },
  tables: {
    gadgets: {
      name: 'gadgets',
      columns: [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'name TEXT NOT NULL',
        'description TEXT',
        'price DECIMAL(10,2) NOT NULL',
        'quantity INTEGER NOT NULL',
        'image_url TEXT',
        'created_at DATETIME DEFAULT CURRENT_TIMESTAMP'
      ]
    }
  }
};