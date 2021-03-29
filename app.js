const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users.js');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '60617700a858206f79089c90',
  };
  next();
});
app.use('/users', usersRouter);

app.listen(PORT, () => {
});
