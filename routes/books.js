'use strict';
var express = require('express');
var router = express.Router();
var Books = require("../models").Books;
var Patrons = require("../models").Patrons;
var Loans = require("../models").Loans;
var models = require('../models');
Books.hasOne(Loans, {foreignKey:"book_id"});
Patrons.hasOne(Loans, {foreignKey:"patron_id"});
Loans.belongsTo(Books, {foreignKey: "book_id"});
Loans.belongsTo(Patrons, {foreignKey: "patron_id"});

let headings = [{ name: "Title"}, {name: "Author"}, {name: "Genre"},{name: "Year Released"}];
router.get('/all', function (req, res, next) {
	Books.findAll().then(function(books) {
		res.render('all', { title: "Books", headings: headings, rows: books, table: "Books", singular: "Book", subNav: "true", filterBar: "true", type: "Display" });
	});
});

//build the Overdue books page.
router.get('/Overdue', function (req, res, next) {
	let today = new Date();
	Books.findAll({
		include: [{
			model: Loans,
			where: { 
				return_by: { $lt: today },
				returned_on: null }
			}]
	}).then( function(books) {
		res.render('books', { title: "Overdue Books", headings: headings, rows: books, table: "Books", singular: "Book", type: "Display"  });
	});
});

// build the Checked out Books page
router.get('/Checked', function (req, res, next) {
	Books.findAll({
		include: [{
			model: Loans,
			where: { 
				returned_on: null }
			}]
	}).then( function(books) {
		res.render('books', { title: "Checked Out Books", headings: headings, rows: books, table: "Books", singular: "Book", type: "Display"  });
	});
});

//build the New Book page.
router.get('/New', function (req, res, next) {
	let thisBook = {title: "", author: "", genre: "", first_published: ""};
	res.render('books', { title: "New Book", headings: headings, type: "Create New Book", book: thisBook })
});

// build the return book page.
router.get('/Return/:loanId/:bookId', function (req, res, next) {
	let bookID = req.params.bookId;
	let loanID = req.params.loanId;
	let dateToday = new Date();
	let today = dateToday.toISOString().substr(0,10);
	console.log("Book:" + bookID + " Loan:" + loanID);
	Loans.findById( loanID ).then(function(loans) {
		Books.findById( bookID ).then(function(books) {
			Patrons.findById ( loans.dataValues.patron_id ).then(function(patrons){ 
				res.render('bookreturn', { title: "Return Book", book: books, loan: loans, patron: patrons, returnDate: today});
			});
		});
	});
});

// Create the new Book, then route to the all books.
router.post('/', function (req, res, next) {
	Books.create(req.body).then(function(books) {
		res.redirect("/Books/All");
	}).catch(function (error) {
		if ((error.name === "SequelizeValidationError") || (error.name === "SequelizeUniqueConstraintError")) {
			res.render("books", {title: "New Book", headings: headings, type: "Create New Book", book: Books.build(req.body), errors: error.errors });
		} else {
			throw error;
		}		
	}).catch(function (error) {
		res.send(500, error)
	});
});

//update the book entry T
router.post("/:id", function (req, res, next) {
	Books.findById(req.params.id).then( function (book) {
		if (book) {
			return book.update(req.body);
		} else {
			res.send(404);
		}
	}).then (function (book) {
		res.redirect('/Books/All');
	}).catch(function (error) {
		if (error.name === 'SequelizeValidationError') {
			let book = Books.build(req.body);
			book.id = req.params.id;
			let bookID = req.params.id;
			let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
			Loans.findAll({
				include: [{ 
					model: Books, 
					where: { id: models.sequelize.col('loans.book_id')} 
				}, { 
					model: Patrons,
					where: { id: models.sequelize.col('loans.patron_id')} 
					 }],
				where: [ {book_id: bookID} ]
			}).then(function (loans) {
				res.render('books', { title: books.dataValues.title, headings: headings, book: book, table: "Books", singular: "Book", type: "Update", loans: loans, errors: error.errors })
			});
		};	// end if
	});		// end catch
});

// Update book route
router.get("/Detail/:data", function (req, res, next) {
	let bookID = req.params.data;
	let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
	Books.findById( bookID ).then(function(books) {
		console.log("Detail route:" + bookID);
		 Loans.findAll({
			//attributes: [ 'id', 'book_id', 'patron_id', 'loaned_on', 'return_by', 'returned_on', `Book`.`title`, `Patron`.`first_name`, `Patron`.`last_name`],
			include: [{ 
				model: Books, 
				where: { id: models.sequelize.col('loans.book_id')} 
			}, { 
				model: Patrons,
				where: { id: models.sequelize.col('loans.patron_id')} 
				 }],
			where: [ {book_id: bookID} ]
		}).then(function(loans) {
			console.log(loans)
			console.log(books)
			res.render('books', { title: books.dataValues.title, headings: headings, book: books, table: "Books", singular: "Book", type: "Update", loans: loans })
		});
	});
});


module.exports = router;