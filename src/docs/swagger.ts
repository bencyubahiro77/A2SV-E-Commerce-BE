import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description:
        'Production-ready E-commerce REST API with Node.js, Express, TypeScript, and PostgreSQL',
      contact: {
        name: 'API Support',
        email: 'bencyubahiro77@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5530/api/v1',
        description: 'Development server (v1)',
      },
      {
        url: 'http://localhost:5530',
        description: 'Base URL',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              nullable: true,
            },
          },
        },
      },
    },
    security: [],
  },
  apis: ['./src/docs/*.yaml', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
