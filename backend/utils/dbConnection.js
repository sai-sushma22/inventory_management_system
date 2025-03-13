const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbConfig = require('../config/database.config');
const logger = require('./logger');

class DatabaseConnection {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.resolve(__dirname, '../', dbConfig.database.filename);
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          logger.error('Database connection error:', err);
          this.isConnected = false;
          reject(err);
        } else {
          logger.info('Connected to SQLite database');
          this.isConnected = true;
          this.initializeTables()
            .then(() => resolve(this.db))
            .catch(reject);
        }
      });
    });
  }

  initializeTables() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database connection not established'));
        return;
      }

      this.db.serialize(() => {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS gadgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            quantity INTEGER NOT NULL,
            image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            logger.error('Gadgets table creation error:', err);
            reject(err);
          } else {
            logger.info('Gadgets table ensured');
            resolve();
          }
        });
      });
    });
  }

  getConnection() {
    if (!this.isConnected || !this.db) {
      throw new Error('Database not connected. Call connect() before using the database.');
    }
    return this.db;
  }

  closeConnection() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            logger.error('Database close error:', err);
            reject(err);
          } else {
            logger.info('Database connection closed');
            this.isConnected = false;
            this.db = null;
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = new DatabaseConnection();