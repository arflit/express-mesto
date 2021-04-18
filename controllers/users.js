const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { checkErrCreate, checkErrFindUser, checkErrUpdate } = require('../utils/errors.js');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key',
        { expiresIn: '7d' });
      // аутентификация успешна
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrFindUser(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrFindUser(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.getMe = (req, res) => {
  User.findById(req.user)
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrFindUser(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrCreate(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrUpdate(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrUpdate(err);
      return (res.status(status).send({ message }));
    });
};
