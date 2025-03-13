const logger = require('../utils/logger');

class GadgetController {
  constructor(gadgetModel) {
    this.gadgetModel = gadgetModel;
  }

  async getAllGadgets(req, res) {
    try {
      const { 
        page, 
        limit, 
        search
      } = req.query;  
      const result = await this.gadgetModel.findAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
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

  async getGadgetById(req, res) {
    try {
      const { id } = req.params;
      const gadget = await this.gadgetModel.findById(id);

      if (!gadget) {
        return res.status(404).json({
          success: false,
          message: 'Gadget not found'
        });
      }
      res.json({
        success: true,
        data: gadget
      });
    } catch (error) {
      logger.error(`Error fetching gadget ${req.params.id}`, error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gadget',
        error: error.message
      });
    }
  }

  async createSingleGadget(req, res) {
    try {
      const gadgetData = req.body;
      if (!gadgetData.name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }
      if (!gadgetData.price) {
        return res.status(400).json({
          success: false,
          message: 'Price is required'
        });
      }
      if (!gadgetData.quantity && gadgetData.quantity !== 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required'
        });
      }
      const createdGadget = await this.gadgetModel.create(gadgetData);
      res.status(201).json({
        success: true,
        data: createdGadget,
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

  async createBulkGadgets(req, res) {
    try {
      const gadgets = req.body;
      if (!Array.isArray(gadgets) || gadgets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input. Expected an array of gadgets'
        });
      }
      const invalidGadgets = gadgets.filter(gadget => 
        !gadget.name || 
        !gadget.price || 
        (gadget.quantity === undefined && gadget.quantity !== 0)
      );
      if (invalidGadgets.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Some gadgets are missing required fields',
          invalidGadgets
        });
      }
      const result = await this.gadgetModel.createBulk(gadgets);
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