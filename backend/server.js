const express = require('express');
const cors = require('cors');
const dbConnection = require('./utils/dbConnection');
const GadgetModel = require('./models/gadgetModel');
const appConfig = require('./config/app.config');
const logger = require('./utils/logger');
const errorMiddleware = require('./middleware/errorMiddleware');

class Server {
  constructor() {
    this.app = express();
    this.gadgetModel = null;
  }

  async initialize() {
    try {
      await dbConnection.connect();
      this.gadgetModel = new GadgetModel();
      this.initializeMiddleware();
      this.initializeRoutes();
      this.initializeErrorHandling();
    } catch (error) {
      logger.error('Server initialization error', error);
      process.exit(1);
    }
  }

  initializeMiddleware() {
    this.app.use(cors(appConfig.cors));
    this.app.use(express.json());
  }

  initializeRoutes() {
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Gadget Inventory Management API',
        endpoints: {
          gadgets: '/api/gadgets',
          documentation: 'Add documentation link here'
        },
        status: 'Running'
      });
    });

    const createGadgetRoutes = require('./routes/gadgetRoutes');
    const gadgetRoutes = createGadgetRoutes(this.gadgetModel);
    this.app.use('/api/gadgets', gadgetRoutes);

    this.app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        requestedUrl: req.originalUrl
      });
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  start() {
    this.app.listen(appConfig.server.port, () => {
      logger.info(`Server running on port ${appConfig.server.port}`);
      logger.info(`Visit http://localhost:${appConfig.server.port}/ for API info`);
    });
  }
}

const server = new Server();
server.initialize().then(() => {
  server.start();
}).catch(error => {
  logger.error('Failed to start server', error);
  process.exit(1);
});