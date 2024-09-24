const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { MongoClient, ObjectID } = require('mongodb');

const uri = 'mongodb+srv://isabellybarbosa07:1709@progweb.ln502.mongodb.net/?retryWrites=true&w=majority&appName=ProgWeb';
let db;

// Conectando ao MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('history');
  })
  .catch(error => console.error(error));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Middleware para tornar o db acessível nas rotas
app.use((req, res, next) => {
  req.dbClient = db; // Disponibiliza o db no req
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
