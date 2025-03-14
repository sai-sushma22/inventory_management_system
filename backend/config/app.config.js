module.exports = {
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true 
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  },
  uploads: {
    maxFileSize: 5 * 1024 * 1024, 
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  security: {
    rateLimitWindowMs: 15 * 60 * 1000, 
    maxRequestsPerWindow: 100
  }
};