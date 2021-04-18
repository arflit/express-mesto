const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorWithStatusCode = require('../middlewares/error-with-status-code');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key',
        { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      })
        .end();
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(new ErrorWithStatusCode(404, 'В базе данных нет пользователей'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new ErrorWithStatusCode(404, 'Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user)
    .orFail(new ErrorWithStatusCode(404, 'Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash,
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      if (err.path === '_id') {
        next(new ErrorWithStatusCode(404, 'Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      if (err.path === '_id') {
        next(new ErrorWithStatusCode(404, 'Пользователь не найден'));
      }
      next(err);
    });
};
