const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for the Node.js project.',
    contact: {
      name: 'Developer',
      email: 'ck2inf@gmail.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:4000/api',
      description: 'Development server'
    },
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        required: ['title', 'price'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the product'
          },
          title: {
            type: 'string',
            description: 'Name of the product',
          },
          price: {
            type: 'number',
            description: 'Price of the product'
          },
        },
      },
      Cart: {
        type: 'object',
        required: ['products'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the cart',
          },
          products: {
            type: 'array',
            description: 'List of products in the cart',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
        },
      },
    },
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  tags: [
    {
      name: 'product',
      description: 'Operations related to products'
    },
    {
      name: 'cart',
      description: 'Operations on the shopping cart'
    },
    {
      name: 'user',
      description: 'Operations for user management'
    },
    {
      name: 'auth',
      description: 'Authentication related operations, such as login and registration'
    },
    {
      name: 'session',
      description: 'Session management for users'
    },
    {
      name: 'message',
      description: 'Operations related to user messaging'
    },
  ],
  
// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/*.js'],
},
// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options),
// Swagger setup function
function setup(app) => {
  // Middleware to serve swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = {
  setup,
  swaggerSpec,
};