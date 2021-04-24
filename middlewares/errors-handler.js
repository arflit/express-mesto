function errorsHandler(err, req, res, next) {
  let { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  if (message === 'celebrate request validation failed') {
    message = err.validation.body.message;
  }

  res
    .status(statusCode)
    .send({
      message,
    });

  next();
}

module.exports = errorsHandler;
