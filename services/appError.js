// class AppError extends Error {
//   constructor(message, statusCode) {
//     super(message);

//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//     this.isOperational = true;

//     Error.captureStackTrace(this, this.constructor);
//   }
// }
const AppError = (status, statusCode, res, message) => {
  res.status(statusCode).json({
    status: status,
    message
  });
};
module.exports = AppError;
