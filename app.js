const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const createError = require('http-errors');
const { MongoClient, ObjectID } = require('mongodb');
const methodOverride = require('method-override');


const uri = 'mongodb+srv://isabellybarbosa07:1709@progweb.ln502.mongodb.net/?retryWrites=true&w=majority&appName=ProgWeb';
let db;

// Conectando ao MongoDB
MongoClient.connect(uri)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db('history');
  })
  .catch(error => console.error(error));

var inicioRouter = require('./routes/inicio');
var sobreRouter = require('./routes/sobre');
var biografiasRouter = require('./routes/biografias');
var authRouter = require('./routes/auth');
var adminRouter = require('./routes/admin');
var sugestoesRouter = require('./routes/sugestoes');


var app = express();

app.use(methodOverride('_method'));

// Middleware para tornar o db acessível nas rotas
app.use((req, res, next) => {
  req.dbClient = db; // Disponibiliza o db no req
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'segredo',  // substitua por um segredo forte em produção
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false  // use secure: true quando estiver usando HTTPS
  }
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', inicioRouter);
app.use('/sobre', sobreRouter);
app.use('/biografias', biografiasRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/sugestoes', sugestoesRouter);


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
