const express = require('express');
const jwt = require('jsonwebtoken');
const secret_key = "secret_key"; 

module.exports = {
  admin: (req, res, next) => {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res.status(403).json({ msg: "Authentication required" });
      }
      const decodedToken = jwt.verify(token, secret_key);
      if (decodedToken.access === "admin") {
        return next();
      } else {
        return res.status(403).json({ msg: "Not an Admin" });
      }

    } catch (error) {
      return res.status(403).json({ msg: "Invalid token or not authorized" });
    }
  }
};
