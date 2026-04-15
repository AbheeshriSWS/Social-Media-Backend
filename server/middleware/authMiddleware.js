const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ msg: "No token" });
    }

    let token;

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};