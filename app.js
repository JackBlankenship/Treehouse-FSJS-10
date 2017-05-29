'use strict';
// version 1.0.3 changes
// 		models/book.js fields title, author, genre have min and max field lengths
//		models/loans.js fields loaned_on and return_by can not be empty.
//		models/patrons.js fields first_name, last_name and address have min and max field lengths
//	-	added jQuery validator to validate date fields on the return loan page.
//  - 	changes to stylesheet/style.css to improve the nav heading. added padding for the search bar to line up visually. color scheme and readability.
//  -	changes to routes/books.js, routes/loans.js and routes/patrons.js from res.send(status, error) due to depreciation to res.status(status).send(error)
//		added logic for "SequelizeTimeoutError" which does not pass back the same error object as other errors. This is a table locked error.
//  - 	change to routes/loans.js added function renderNewLoan(hasErrors, res, errors) refactoring get /new and post / logic duplication.
//		added function bookReturnErrors(req, res, errors) refactoring in post /:id because SequelizeTimeoutError passes different error object.
//  - 	change to routes/books.js corrected spelling error of books.dataValues.title to book.dataValues.title in post /:id error logic
//	- 	changes to views/index.pug added missing loans/overdue and loans/checked links
//  -	changes to view/loan.pug added error partial and jQuery validation on dates
//	- 	changes to view/partials/_loan.pug to support jQuery date validtion on returned_on date that is not a required field in the models/loans.js
//
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var books = require('./routes/books');
var patrons = require('./routes/patrons');
var loans = require('./routes/loans');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // TODO change all the views to .pug

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/all', all);
//app.use('/new', newEntry);
app.use('/Books', books);
app.use('/Patrons', patrons);
app.use('/Loans', loans);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
