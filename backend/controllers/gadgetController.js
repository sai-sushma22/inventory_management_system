const logger = require('../utils/logger');

class GadgetController {
  constructor(gadgetModel) {
    this.gadgetModel = gadgetModel;
  }

  async getAllGadgets(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search 
      } = req.query;  
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
      const result = await this.gadgetModel.findAll({
        page: pageNum,
        limit: limitNum,
        search
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('Error fetching gadgets', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gadgets',
        error: error.message
      });
    }
  }

  async createSingleGadget(req, res) {
    try {
      const gadgetData = req.body;
      const validationErrors = this.validateGadgetData(gadgetData);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      const sanitizedData = this.sanitizeGadgetData(gadgetData);
      const createdGadget = await this.gadgetModel.create(sanitizedData);
      res.status(201).json({
        success: true,
        gadgets: [createdGadget],
        message: 'Gadget created successfully'
      });
    } catch (error) {
      logger.error('Error creating gadget', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create gadget',
        error: error.message
      });
    }
  }

  validateGadgetData(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required and cannot be empty');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }

    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    }

    if (typeof data.price === 'number' && data.price <= 0) {
      errors.push('Price must be a positive number');
    }

    if (data.quantity === undefined || data.quantity === null) {
      errors.push('Quantity is required');
    }

    if (typeof data.quantity === 'number' && data.quantity < 0) {
      errors.push('Quantity cannot be negative');
    }

    return errors;
  }

  sanitizeGadgetData(data) {
    return {
      name: data.name ? data.name.trim() : '',
      description: data.description ? data.description.trim() : '',
      price: parseFloat(data.price) || 0,
      quantity: parseInt(data.quantity) || 0,
      image_url: data.image_url || null,
      category: data.category || null,
      brand: data.brand || null
    };
  }

  async createBulkGadgets(req, res) {
    try {
      const gadgets = req.body;

      if (!Array.isArray(gadgets) || gadgets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of gadgets'
        });
      }

      const processedGadgets = [];
      const invalidGadgets = [];

      for (const gadget of gadgets) {
        const validationErrors = this.validateGadgetData(gadget);
        
        if (validationErrors.length > 0) {
          invalidGadgets.push({
            gadget,
            errors: validationErrors
          });
        } else {
          processedGadgets.push(this.sanitizeGadgetData(gadget));
        }
      }

      if (invalidGadgets.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Some gadgets have validation errors',
          invalidGadgets
        });
      }

      const result = await this.gadgetModel.createBulk(processedGadgets);
      res.status(201).json({
        success: true,
        ...result,
        message: 'Bulk gadget creation processed'
      });
    } catch (error) {
      logger.error('Error in bulk gadget creation', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create bulk gadgets',
        error: error.message
      });
    }
  }

  async updateSingleGadget(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      if (updateData.price !== undefined && updateData.price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number'
        });
      }
      if (updateData.quantity !== undefined && updateData.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity cannot be negative'
        });
      }
      const result = await this.gadgetModel.update(id, updateData);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Gadget not found'
        });
      }
      res.json({
        success: true,
        data: result,
        message: 'Gadget updated successfully'
      });
    } catch (error) {
      logger.error(`Error updating gadget ${req.params.id}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to update gadget',
        error: error.message
      });
    }
  }

  async updateBulkGadgets(req, res) {
    try {
      const gadgets = req.body;
      if (!Array.isArray(gadgets) || gadgets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of gadgets'
        });
      }
      const invalidGadgets = gadgets.filter(gadget => {
        if (!gadget.id) return true;
        if (gadget.price !== undefined && gadget.price <= 0) return true;
        if (gadget.quantity !== undefined && gadget.quantity < 0) return true;
        return false;
      });
      if (invalidGadgets.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid gadget data',
          invalidGadgets
        });
      }
      const result = await this.gadgetModel.updateBulk(gadgets);
      res.json({
        success: true,
        ...result,
        message: 'Bulk gadget update processed'
      });
    } catch (error) {
      logger.error('Error in bulk gadget update', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update bulk gadgets',
        error: error.message
      });
    }
  }

  async deleteSingleGadget(req, res) {
    try {
      const { id } = req.params;
      const result = await this.gadgetModel.delete(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Gadget not found'
        });
      }
      res.json({
        success: true,
        data: result,
        message: 'Gadget deleted successfully'
      });
    } catch (error) {
      logger.error(`Error deleting gadget ${req.params.id}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete gadget',
        error: error.message
      });
    }
  }

  async deleteBulkGadgets(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of gadget IDs'
        });
      }
      const invalidIds = ids.filter(id => isNaN(parseInt(id)));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format',
          invalidIds
        });
      }
      const result = await this.gadgetModel.deleteBulk(ids);
      res.json({
        success: true,
        ...result,
        message: 'Bulk gadget deletion processed'
      });
    } catch (error) {
      logger.error('Error in bulk gadget deletion', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete bulk gadgets',
        error: error.message
      });
    }
  }
}

module.exports = (gadgetModel) => {
  return new GadgetController(gadgetModel);
};