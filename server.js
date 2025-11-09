const express = require('express');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('./routes');
const { initDb } = require('./db/connect');
require('dotenv').config();
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());

// Routes
app.use('/', routes);

// Swagger documentation
app.get('/swagger.json', (req, res) => {
  res.json(swaggerDocument);
});

// Swagger UI with OAuth2 configuration
const swaggerUiOptions = {
  swaggerOptions: {
    oauth: {
      clientId: process.env.CLIENT,
      realm: 'google',
      appName: 'Recipe Manager API',
      scopeSeparator: ' ',
      additionalQueryStringParams: {},
      useBasicAuthenticationWithAccessCodeGrant: false,
      usePkceWithAuthorizationCodeGrant: false
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

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
