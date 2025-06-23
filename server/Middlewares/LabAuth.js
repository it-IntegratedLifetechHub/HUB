const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Check for token in multiple places (header, cookies, query)
  let token =
    req.header("x-auth-token") || req.cookies.labToken || req.query.token;

  if (!token) {
    return res.status(401).json({
      msg: "No token, authorization denied",
      redirect: "/lab/login", // Frontend can use this to redirect
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Additional check for role if needed
    if (decoded.role !== "lab") {
      return res.status(403).json({ msg: "Invalid access level" });
    }

    req.laboratory = decoded.laboratory;
    next();
  } catch (err) {
    // Differentiate between different types of token errors
    let message = "Token is not valid";
    if (err.name === "TokenExpiredError") {
      message = "Token expired. Please login again";
    }
    res.status(401).json({
      msg: message,
      redirect: "/lab/login",
    });
  }
};
