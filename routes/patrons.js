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
	let headings = [{ name: "Name"}, {name: "Address"}, {name: "Email"},{name: "Library ID"}, {name: "Zip"}];
	Patrons.findAll().then(function (patrons) {
		res.render('patrons', { title: "Patrons", headings: headings, rows: patrons, table: "Patrons", singular: "Patron", type: "Display" });
	});
});

router.get('/new', function (req, res, next) {
	let patron = {id: 0, first_name: "", last_name: "", address: "", email: "", library_id: "", zip_code: "" };
	res.render('patrons', {title: "Patron", type: "New", patron: patron}); //'patronnew'
});

// Create the new Patron, then route to the all page. 
router.post('/', function (req, res, next) {
	Patrons.create(req.body).then(function(patrons) {
		res.redirect("/Patrons/All");
	}).catch(function (error) {
		if ((error.name === "SequelizeValidationError") || (error.name === "SequelizeUniqueConstraintError")) {
			res.render("patrons", {title: "Patron", type: "New", patron: Patrons.build(req.body), errors: error.errors });
		} else {
			throw error;
		}		
	}).catch(function (error) {
		res.send(500, error)
	});
});

// TODO Update Patron.
router.post('/:id', function (req, res, next) {
	Patrons.findById(req.params.id).then( function (patron) {
		if (patron) {
			return patron.update(req.body);
		} else {
			res.send(404);
		}
	}).then (function (book) {
		res.redirect("/Patrons/All");
	}).catch(function (error) {
		if (error.name === 'SequelizeValidationError') {
			let patron = Patrons.build(req.body);
			patron.id = req.params.id;
			let patronID = req.params.id;
			let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
			Loans.findAll({
				include: [{ 
					model: Books, 
					where: { id: models.sequelize.col('loans.book_id')} 
				}, { 
					model: Patrons,
					where: { id: models.sequelize.col('loans.patron_id')} 
					 }],
				where: [ {patron_id: patronID} ]
			}).then(function (loans) {
				res.render('patrons', { title: patron.first_name + ' ' + patron.last_name, headings: headings, patron: patron, loans: loans, table: "Patrons", singular: "Patron", type: "Update", errors: error.errors })
			});
		};	// end if
	});		// end catch
});

router.get('/Detail/:id', function (req, res, next) {
	let patronId = req.params.id;
	let headings = [{ name: "Book"}, {name: "Patron"}, {name: "Loaned on"},{name: "Return by"}, {name: "Returned on"}, {name: "Action"}];
	console.log("Patron detail:" + patronId);
	Patrons.findById( patronId ).then( function (patron) {
		 Loans.findAll({
			//attributes: [ 'id', 'book_id', 'patron_id', 'loaned_on', 'return_by', 'returned_on', `Book`.`title`, `Patron`.`first_name`, `Patron`.`last_name`],
			include: [{ 
				model: Books, 
				where: { id: models.sequelize.col('loans.book_id')} 
			}, { 
				model: Patrons,
				where: { id: models.sequelize.col('loans.patron_id')} 
				 }],
			where: [ {patron_id: patronId} ]
		}).then( function (loans) {
			res.render('patrons', { title: patron.first_name + ' ' + patron.last_name, headings: headings, patron: patron, loans: loans, table: "Patrons", singular: "Patron", type: "Update" });
		});
	});
});

module.exports = router;