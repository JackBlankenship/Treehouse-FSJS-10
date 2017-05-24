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

router.get('/all', function (req, res, next) {
	let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
	Loans.findAll({
	//	attributes: [ 'id', 'book_id', 'patron_id', 'loaned_on', 'return_by', 'returned_on', `Book`.`title`, `Patron`.`first_name`, `Patron`.`last_name`],
		include: [{ 
				model: Books, 
				where: { id: models.sequelize.col('loans.book_id')} 
			}, { 
				model: Patrons,
				where: { id: models.sequelize.col('loans.patron_id')} 
				 }]
	}).then(function (loans) {
		res.render('all', { title: "Loans", headings: headings, loans: loans, table: "Loans", singular: "Loan", subNav: "true", filterBar: "true", type: "Display" });
	});
});

router.get('/new', function (req, res, next) {
	Books.findAll({

	}).then(function (books) {

		let availableBooks = [];
		for (let i=0; i < books.length; i++) {
			// Find all loans where a book is still checked out.
			Loans.findAll({ where: { book_id: books[i].dataValues.id, returned_on:  null } }).then( function (loan) {
				if (loan.length > 0) {
														// do nothing. This book is checked out.
				} else {
					availableBooks.push(books[i]);		// availble for checkout
				}		// endIF
			})			// end Loan.findAll .then
		}				// end for loop
		let dateToday = new Date();
		let today = dateToday.toISOString().substr(0,10);
		let inSeven = new Date();
		inSeven.setDate(dateToday.getDate() + 7);
		let dueDate = inSeven.toISOString().substr(0,10); 
		let thisLoan = {id: "", book_id: "", patron_id: "", loaned_on: today, return_by: dueDate, returned_on: ""};
		Patrons.findAll({}).then( function (patrons) {
			res.render('loan', { title: "Loans", books: availableBooks, patrons: patrons, loan: thisLoan, table: "Loans", singular: "Loan", type: "Create New Loan" });
		});
	});
});
//TODO update the below POST prpocess for new loans from the book copy
// Create the new Loan, then route to the detail page.
router.post('/', function (req, res, next) {
	Loans.create(req.body).then(function(loans) {
		res.redirect("/Loans/All");
	}).catch(function (error) {
		if ((error.name === "SequelizeValidationError") || (error.name === "SequelizeUniqueConstraintError")) {
			res.render("loan", {title: "Loan", headings: headings, type: "Create New Loan", loan: Loans.build(req.body), errors: error.errors });
		} else {
			throw error;
		}		
	}).catch(function (error) {
		res.send(500, error)
	});
});

router.post('/:id', function (req, res, next) {
	Loans.findById(req.params.id).then( function (loan) {
		if (loan) {
			return loan.update(req.body);
		} else {
			res.send(404);
		}
	}).then (function (loan) {
		res.redirect('/Books/All');
	}).catch(function (error) {
		if (error.name === 'SequelizeValidationError') {
			let loan = Loans.build(req.body);
			loan.id = req.params.id;
			let loanID = req.params.id;
			Loans.findById( loanID ).then( function (loan) {
				Books.findById( loan.book_id ).then( function (book) {
					Patrons.findById( loan.patron_id ).then ( function (patron) {
						res.render('bookreturn', { title: "Return Book", book: book, loan: loan, patron: patron, errors: error.errors })
				// 	res.render('bookreturn', { title: "Return Book", book: books, loan: loans, patron: patrons});
					});		// End Patron
				});			// End Book
			});				// End Loan
		};					// end if
	});						// end catch
});

router.get('/overdue', function (req, res, next) {
	let today = new Date;
	let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
	Loans.findAll({
	//	attributes: [ 'id', 'book_id', 'patron_id', 'loaned_on', 'return_by', 'returned_on', `Book`.`title`, `Patron`.`first_name`, `Patron`.`last_name`],
		where: [{ 
			return_by: { $lt: today },
			returned_on: null }],
		include: [{ 
				model: Books, 
				where: { id: models.sequelize.col('loans.book_id')} 
			}, { 
				model: Patrons,
				where: { id: models.sequelize.col('loans.patron_id')} 
				 }]
	}).then(function(loans) {
		res.render('all', { title: "Loans", headings: headings, loans: loans, table: "Loans", singular: "Loan", subNav: "true", filterBar: "true", type: "Display" });
	});
});

router.get('/checked', function (req, res, next) {

	let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
	Loans.findAll({
	//	attributes: [ 'id', 'book_id', 'patron_id', 'loaned_on', 'return_by', 'returned_on', `Book`.`title`, `Patron`.`first_name`, `Patron`.`last_name`],
		where: [{ returned_on: null }],
		include: [{ 
				model: Books, 
				where: { id: models.sequelize.col('loans.book_id')} 
			}, { 
				model: Patrons,
				where: { id: models.sequelize.col('loans.patron_id')} 
				 }]
	}).then(function(loans) {
		res.render('loan', { title: "Loans", headings: headings, loans: loans, table: "Loans", singular: "Loan", subNav: "true", filterBar: "true", type: "Display" });
	});
});

module.exports = router;