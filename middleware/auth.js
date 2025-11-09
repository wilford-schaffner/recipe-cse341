// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
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

