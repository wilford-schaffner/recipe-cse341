const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('./routes');
const { initDb } = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Swagger documentation
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://recipe-cse341.onrender.com' 
        : `http://localhost:${PORT}`;
      console.log(`Swagger documentation available at ${baseUrl}/api-docs`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
