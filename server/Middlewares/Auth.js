const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization header missing" 
    });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false,
      message: "Unauthorized - Invalid or expired token" 
    });
  }
};

module.exports = ensureAuthenticated;