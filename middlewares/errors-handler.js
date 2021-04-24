function errorsHandler(err, req, res, next) {
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  console.log(err);
  res
    .status(statusCode)
    .send({
      message,
    });

  next();
}

module.exports = errorsHandler;
