class CustomError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const handleErrors = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({ error: message });
  };
  
  const createError = (message, status = 400) => {
    return new CustomError(message, status);
  };
  
  module.exports = {
    handleErrors,
    createError,
    CustomError
  };
  