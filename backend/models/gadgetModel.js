const dbConnection = require('../utils/dbConnection');
const logger = require('../utils/logger');

class GadgetModel {
  constructor() {
    this.db = dbConnection.getConnection();
  }

  findAll(options = {}) {
    return new Promise((resolve, reject) => {
      const { 
        page = 1, 
        limit = 10,
        search
      } = options;
      let query = 'SELECT * FROM gadgets WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));
      this.db.all(query, params, (err, rows) => {
        if (err) {
          logger.error('Error fetching gadgets', err);
          reject(err);
          return;
        }
        resolve({
          gadgets: rows,
          page,
          limit
        });
      });
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM gadgets WHERE id = ?';
      
      this.db.get(query, [id], (err, row) => {
        if (err) {
          logger.error(`Error finding gadget with ID ${id}`, err);
          reject(err);
          return;
        }

        resolve(row);
      });
    });
  }

  create(gadgetData) {
    return new Promise((resolve, reject) => {
      const { 
        name, 
        description, 
        price, 
        quantity, 
        image_url 
      } = gadgetData;

      const query = `
        INSERT INTO gadgets 
        (name, description, price, quantity, image_url) 
        VALUES (?, ?, ?, ?, ?)
      `;
      this.db.run(
        query,
        [name, description, price, quantity, image_url],
        function(err) {
          if (err) {
            logger.error('Error creating gadget', err);
            reject(err);
            return;
          }
          logger.info(`Gadget created with ID: ${this.lastID}`);
          resolve({
            id: this.lastID,
            ...gadgetData
          });
        }
      );
    });
  }

  createBulk(gadgets) {
    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];
      this.db.run('BEGIN TRANSACTION');
      const stmt = this.db.prepare(`
        INSERT INTO gadgets 
        (name, description, price, quantity, image_url) 
        VALUES (?, ?, ?, ?, ?)
      `);
      gadgets.forEach(gadget => {
        stmt.run(
          [
            gadget.name, 
            gadget.description, 
            gadget.price, 
            gadget.quantity, 
            gadget.image_url
          ],
          function(err) {
            if (err) {
              errors.push({
                gadget,
                error: err.message
              });
            } else {
              results.push({
                id: this.lastID,
                ...gadget
              });
            }
          }
        );
      });
      stmt.finalize((err) => {
        if (err) {
          this.db.run('ROLLBACK');
          reject(err);
          return;
        }
        this.db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            logger.error('Transaction commit error', commitErr);
            reject(commitErr);
            return;
          }
          logger.info(`Bulk create processed: ${results.length} successful, ${errors.length} errors`);
          resolve({ results, errors });
        });
      });
    });
  }

  update(id, updateData) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateData)
        .filter(key => updateData[key] !== undefined)
        .map(key => `${key} = ?`)
        .join(', ');
      if (!fields) {
        reject(new Error('No fields to update'));
        return;
      }
      const values = Object.keys(updateData)
        .filter(key => updateData[key] !== undefined)
        .map(key => updateData[key]);
      values.push(id);
      const query = `
        UPDATE gadgets 
        SET ${fields} 
        WHERE id = ?
      `;
      this.db.run(query, values, function(err) {
        if (err) {
          logger.error(`Error updating gadget ${id}`, err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          logger.warn(`No gadget found with ID ${id}`);
          resolve(null);
          return;
        }
        logger.info(`Gadget ${id} updated successfully`);
        resolve({
          id,
          changes: this.changes
        });
      });
    });
  }

  updateBulk(gadgets) {
    return new Promise((resolve, reject) => {
      const results = [];
      const errors = [];
      this.db.run('BEGIN TRANSACTION');
      const stmt = this.db.prepare(`
        UPDATE gadgets 
        SET 
          name = COALESCE(?, name), 
          description = COALESCE(?, description), 
          price = COALESCE(?, price), 
          quantity = COALESCE(?, quantity), 
          image_url = COALESCE(?, image_url)
        WHERE id = ?
      `);
      gadgets.forEach(gadget => {
        if (!gadget.id) {
          errors.push({
            gadget,
            error: 'Gadget ID is required for update'
          });
          return;
        }
        stmt.run(
          [
            gadget.name, 
            gadget.description, 
            gadget.price, 
            gadget.quantity, 
            gadget.image_url, 
            gadget.id
          ],
          function(err) {
            if (err) {
              errors.push({
                gadget,
                error: err.message
              });
            } else {
              results.push({
                id: gadget.id,
                changes: this.changes
              });
            }
          }
        );
      });
      stmt.finalize((err) => {
        if (err) {
          this.db.run('ROLLBACK');
          reject(err);
          return;
        }
        this.db.run('COMMIT', (commitErr) => {
          if (commitErr) {
            logger.error('Transaction commit error', commitErr);
            reject(commitErr);
            return;
          }
          logger.info(`Bulk update processed: ${results.length} successful, ${errors.length} errors`);
          resolve({ results, errors });
        });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM gadgets WHERE id = ?';
      this.db.run(query, [id], function(err) {
        if (err) {
          logger.error(`Error deleting gadget ${id}`, err);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          logger.warn(`No gadget found with ID ${id}`);
          resolve(null);
          return;
        }
        logger.info(`Gadget ${id} deleted successfully`);
        resolve({
          id,
          deleted: this.changes
        });
      });
    });
  }

  deleteBulk(ids) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(ids) || ids.length === 0) {
        return reject(new Error('Invalid input. Expected an array of gadget IDs'));
      }
      const placeholders = ids.map(() => '?').join(',');
      const query = `DELETE FROM gadgets WHERE id IN (${placeholders})`;
      this.db.run(query, ids, function(err) {
        if (err) {
          logger.error('Bulk delete error', err);
          return reject(err);
        }
        logger.info(`Bulk delete processed: ${this.changes} gadgets deleted`);
        resolve({
          deleted: this.changes,
          ids
        });
      });
    });
  }
}

module.exports = GadgetModel;