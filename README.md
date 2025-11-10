# E-Commerce REST API

A production-ready e-commerce REST API built with Node.js, Express, TypeScript, and Prisma ORM.

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, rate limiting
- **Documentation**: Swagger UI
- **Logging**: Winston

## Prerequisites

- Node.js (v18+)
- npm

## Quick Start

1. **Clone and install**
```bash
git clone https://github.com/bencyubahiro77/A2SV-E-Commerce-BE.git
cd A2SV-E-Commerce-BE
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Update JWT_SECRET and other variables in .env
```

3. **Setup database**
```bash
npm run db:setup
```

4. **Add migration name**
```bash
# example: init
```

5. **Run the application**
```bash
npm run dev
```

The API will be available at `http://localhost:5530`

## API Documentation

Access interactive API docs at: `http://localhost:5530/api-docs`

## Project Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── routes/           # API routes
├── middlewares/      # Custom middleware
├── validators/       # Request validation
├── utils/            # Helper functions
└── types/            # TypeScript types
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:setup` | Setup and seed database |
| `npm run prisma:studio` | Open database GUI |

## Environment Variables

Key variables to configure in `.env`:

- `PORT` - Server port (default: 5530)
- `JWT_SECRET` - Secret key for JWT (required)
- `DATABASE_URL` - Database path (default: file:./dev.db)
- `CORS_ORIGIN` - Allowed origin (default: http://localhost:3000)

See `.env.example` for complete list.

## Database Schema

- **User** - Authentication and user management
- **Product** - Product catalog
- **Order** - Order management
- **OrderItem** - Order line items

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

## License

ISC