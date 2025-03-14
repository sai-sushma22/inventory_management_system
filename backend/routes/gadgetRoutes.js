const express = require('express');
const multer = require('multer');
const path = require('path');

module.exports = (gadgetModel) => {
    const router = express.Router();
    const createGadgetController = require('../controllers/gadgetController');
    const gadgetController = createGadgetController(gadgetModel);
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../uploads/images'));
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    const upload = multer({ 
        storage: storage,
        limits: { 
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
            }
        }
    });

    router.post('/upload', upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        res.json({
            success: true,
            imageUrl: `/uploads/images/${req.file.filename}`
        });
    });

    router.get('/', (req, res) => gadgetController.getAllGadgets(req, res));
    router.get('/:id', (req, res) => gadgetController.getGadgetById(req, res));
    router.get('/count', (req, res) => {
        try {
            return gadgetController.getGadgetCount(req, res);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get gadget count'
            });
        }
    });

    router.get('/exists/:id', (req, res) => {
        try {
            return gadgetController.checkGadgetExists(req, res);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to check gadget existence'
            });
        }
    });

    router.post('/single', (req, res) => gadgetController.createSingleGadget(req, res));
    router.post('/bulk', (req, res) => gadgetController.createBulkGadgets(req, res));
    router.put('/single/:id', (req, res) => gadgetController.updateSingleGadget(req, res));
    router.put('/bulk', (req, res) => gadgetController.updateBulkGadgets(req, res));
    router.delete('/single/:id', (req, res) => gadgetController.deleteSingleGadget(req, res));
    router.delete('/bulk', (req, res) => gadgetController.deleteBulkGadgets(req, res));

    return router;
};