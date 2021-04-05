const User = require('../models/user');
const { checkErrCreate, checkErrFindUser, checkErrUpdate } = require('../utils/errors.js');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrFindUser(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrFindUser(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrCreate(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrUpdate(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const { status, message } = checkErrUpdate(err);
      return (res.status(status).send({ message }));
    });
};
