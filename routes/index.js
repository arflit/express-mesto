const router = require('express').Router();
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorsHandler = require('../middlewares/errors-handler');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),

  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),

  }),
}), createUser);
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
router.use(errors);
router.use(errorsHandler);

module.exports = router;
