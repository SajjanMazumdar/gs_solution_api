
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');
const helmet = require('helmet');

require('dotenv').config();

const app = express();
app.use(compression());
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const proxyRouter = require('./routes/proxy_routes');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', proxyRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if(err && err.message != "") {
    return res.status(err. status || 400).json({
      error: true,
      details: err.message,
      message: err.message,
      msg: err.message,
      result: []
    });
  } else if(err) {
    return res.status(err.status || 500).json({
      error: true,
      details: "Something went wrong",
      message: "Something went wrong",
      msg: "Something went wrong",
      result: []
    });
  }
  next();
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception thrown:', err);
  logger.error('uncaughtException: Something went wrong');
  process.exit(); // Exit the process with failure
});

app.listen(() => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});

module.exports = app;
