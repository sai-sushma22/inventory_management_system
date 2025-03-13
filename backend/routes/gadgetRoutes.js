const express = require('express');

module.exports = (gadgetModel) => {
    const router = express.Router();
    const createGadgetController = require('../controllers/gadgetController');
    const gadgetController = createGadgetController(gadgetModel);

  router.get('/', (req, res) => gadgetController.getAllGadgets(req, res));
  router.get('/:id', (req, res) => gadgetController.getGadgetById(req, res));
  router.get('/count', (req, res) => gadgetController.getGadgetCount(req, res));
  router.get('/exists/:id', (req, res) => gadgetController.checkGadgetExists(req, res));
  router.post('/single', (req, res) => gadgetController.createSingleGadget(req, res));
  router.post('/bulk', (req, res) => gadgetController.createBulkGadgets(req, res));
  router.put('/single/:id', (req, res) => gadgetController.updateSingleGadget(req, res));
  router.put('/bulk', (req, res) => gadgetController.updateBulkGadgets(req, res));
  router.delete('/single/:id', (req, res) => gadgetController.deleteSingleGadget(req, res));
  router.delete('/bulk', (req, res) => gadgetController.deleteBulkGadgets(req, res));

  return router;
};