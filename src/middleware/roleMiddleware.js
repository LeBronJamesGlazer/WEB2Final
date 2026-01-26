const authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        res.status(403);
        const err = new Error(`User role '${req.user.role}' is not authorized to access this route`);
        err.statusCode = 403;
        return next(err);
      }
      next();
    };
  };
  
  module.exports = { authorize };
