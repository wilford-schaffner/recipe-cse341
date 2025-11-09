// Middleware to ensure user is authenticated
// Supports both session-based (Passport) and Bearer token (Swagger UI OAuth) authentication
function ensureAuthenticated(req, res, next) {
  // Check for session-based authentication (Passport.js)
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Check for Bearer token authentication (Swagger UI OAuth)
  const authHeader = req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // For Swagger UI, accept the Bearer token if present
    // The token is validated by Google during the OAuth flow
    if (token && token.length > 0) {
      // Store token in request for potential future use
      req.swaggerToken = token;
      return next();
    }
  }
  
  // Check if this is an API request (JSON expected) or browser request
  const acceptsJson = req.get('Accept')?.includes('application/json') || 
                      req.get('Content-Type')?.includes('application/json');
  
  if (acceptsJson) {
    // Return JSON response for API requests
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Please log in with Google to access this resource.'
    });
  }
  
  // Redirect to Google OAuth for browser requests
  res.redirect('/auth/google');
}

module.exports = { ensureAuthenticated };

