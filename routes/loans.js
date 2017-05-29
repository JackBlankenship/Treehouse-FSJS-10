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

function renderNewLoan (hasErrors, res, errors) {

	let checkedBooks = [];
	Loans.findAll({ where: { returned_on:  null } })		// get all the books still on loan
	.then( function (onloan) {
		for (let i=0; i < onloan.length; i++) {				// build the array
			checkedBooks.push(onloan[i].book_id);
		};
		Books.findAll({ where : { id: { $notIn: checkedBooks}}}).then( function (availableBooks) {		// exclude checked out.
			let dateToday = new Date();
			let today = dateToday.toISOString().substr(0,10);
			let inSeven = new Date();
			inSeven.setDate(dateToday.getDate() + 7);
			let dueDate = inSeven.toISOString().substr(0,10); 
			let thisLoan = {id: "", book_id: "", patron_id: "", loaned_on: today, return_by: dueDate, returned_on: ""};
			Patrons.findAll({}).then( function (patrons) {
				if (hasErrors) {
					res.render('loan', { title: "Loans", books: availableBooks, patrons: patrons, loan: thisLoan, table: "Loans", singular: "Loan", type: "Create New Loan", errors: errors  });
				} else {
					res.render('loan', { title: "Loans", books: availableBooks, patrons: patrons, loan: thisLoan, table: "Loans", singular: "Loan", type: "Create New Loan" });
				}
			});		// end Patrons
		});			// end Books Theoretically I could un nest Books and Patrons and use Promise.all
	});				// end Loans
};

function bookReturnErrors(req, res, errors) {
	let loan = Loans.build(req.body);
	loan.id = req.params.id;
	let loanID = req.params.id;
	Loans.findById( loanID ).then( function (loan) {
		Books.findById( loan.book_id ).then( function (book) {
			Patrons.findById( loan.patron_id ).then ( function (patron) {
				res.render('bookreturn', { title: "Return Book", book: book, loan: loan, patron: patron, errors: errors })
			});		// End Patron
		});			// End Book
	});				// End Loan
};

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
	renderNewLoan(false, res);	// no error messages
});					// end Route

// Create the new Loan, then route to the detail page.
router.post('/', function (req, res, next) {
	Loans.create(req.body).then(function(loans) {
		res.redirect("/Loans/All");
	}).catch(function (error) {
		if ((error.name === "SequelizeValidationError") || (error.name === "SequelizeUniqueConstraintError") ) {
			renderNewLoan(true, res, error.errors);	// has an error
		} else if ( error.name === "SequelizeTimeoutError") {
			let errors = [ { message: error.message}];
			renderNewLoan(true, res, errors);	// has an error
		} else	{
			throw error;
		}		
	}).catch(function (error) {
		res.status(500).send(error)
//		res.send(500, error)
	});
});

router.post('/:id', function (req, res, next) {
	Loans.findById(req.params.id).then( function (loan) {
		if (loan) {
			return loan.update(req.body);
		} else {
			res.status(404);
		}
	}).then (function (loan) {
		res.redirect('/Loans/All');
	}).catch(function (error) {
		if ((error.name === "SequelizeValidationError") || (error.name === "SequelizeUniqueConstraintError")) {
			bookReturnErrors(req, res, error.errors);
		} else if (error.name === "SequelizeTimeoutError")  {
			let errors = [ { message: error.message}];
			bookReturnErrors(req, res, errors);
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