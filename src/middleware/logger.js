'use strict';

/// Middleware, simply logs the path that was called and with what method
const logger = (req, res, next) => {
  console.log('request:', req.method, req.path);
  next();
};

module.exports = logger;
