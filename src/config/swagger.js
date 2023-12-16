const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for our project.',
  },
  servers: [
    {
      url: 'http://localhost:4000/api',
      description: 'Local server',
    },
  ],
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

function setup(app) {
  // Serve swagger docs the way you like (Recommendation: swagger-tools)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setup,
  swaggerSpec,
};