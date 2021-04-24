function errorsHandler(err, req, res, next) {
  res.send(err);
/*   const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  res
    .status(statusCode)
    .send({
      message,
    }); */

  next();
}

module.exports = errorsHandler;
