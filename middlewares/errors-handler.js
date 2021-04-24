function errorsHandler(err, req, res, next) {
  let { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  if (message === 'celebrate request validation failed') {
    message = err;
    statusCode = 400;
  }
  res
    .status(statusCode)
    .send({
      message,
    });

  next();
}

module.exports = errorsHandler;
