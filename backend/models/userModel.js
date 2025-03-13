const dbConnection = require('../utils/dbConnection');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class UserModel {
  constructor() {
    this.db = dbConnection.getConnection();
    this.initializeUserTable();
  }

  initializeUserTable() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async registerUser(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password } = userData;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const query = `
        INSERT INTO users 
        (username, email, password) 
        VALUES (?, ?, ?)
      `;
      this.db.run(query, [username, email, hashedPassword], function(err) {
        if (err) {
          logger.error('User registration error', err);
          reject(err);
          return;
        }
        resolve({
          id: this.lastID,
          username,
          email
        });
      });
    });
  }

  async findUser(identifier) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM users 
        WHERE username = ? OR email = ?
      `;
      this.db.get(query, [identifier, identifier], (err, user) => {
        if (err) {
          logger.error('Find user error', err);
          reject(err);
          return;
        }
        resolve(user);
      });
    });
  }
}

module.exports = new UserModel();