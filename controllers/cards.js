const Card = require('../models/card');
const { checkErrCreate, checkErrFindCard } = require('../utils/errors.js');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      const { status, message } = checkErrFindCard(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = checkErrCreate(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return Promise.reject(new Error('Вы пытаетесь удалить чужую карточку'));
      }
      return card;
    })
    .then((card) => {
      card.remove();
    })
    .then(() => Card.find({}))
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = checkErrFindCard(err);
      return (res.status(status).send({ message }));
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => {
      const { status, message } = checkErrFindCard(err);
      return (res.status(status).send({ message }));
    });
};
