import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Ecommerce Practice API',
    version: '1.0.0',
    description: 'API documentation for Ecommerce Practice application',
    contact: {
      name: 'Development Team',
      email: 'dev@ecommerce-practice.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
    {
      url: 'http://localhost:5500/api',
      description: 'Docker development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/swagger/paths/*.yaml',
    './src/swagger/schemas/*.yaml',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);