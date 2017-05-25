'use strict';
//* --------------------- *//
//* Global variables      *//
//* --------------------- *//

var fullItemsArray = [];
var pageCount = 1;
var itemCount = 1;
var itemsPerPage = 5;
var pageinates = 0;
var partialItemsArray = [];
var thisHTML = '';
var startingItem = 0;
var endingItem = 0;
var itemName = '';
var partialItemsArray = [];

//* --------------------- *//
//* DOM variables         *//
//* --------------------- *//

var table = document.getElementById("table").innerText;
const classItem = '.item';
const dItem = document.getElementById("item");
const eItemsTooMany = '<div class="error"> Too many ' + table + ' found. Please modify your search</div>';
const eItemssNone = '<div class="error"> No ' + table + ' found with that name. Please modify your search</div>';

const searchHTML = '<div class="list-search"><input placeholder="Search for ' + table + '..."><button>Search</button></div>';

var pageinateHTML = '<div class="pagination"> <ul> <li><a class="active" href="#">1</a> </li></ul></div>';

// get all the data from the html regarding items and put into an array;
var $itemsName = $(".item-name");		// create a item name array to be used below.
var $item = $(classItem).children();		// itemsDetailsAll

//* --------------------- *//
//* Function section      *//
//* --------------------- *//

//const setPaginateButtons = (thisArray) => {
function setPaginateButtons(thisArray) {
	pageinates = Math.ceil(thisArray.length / itemsPerPage);	// you have to account for partial page
																// use the array and items per page to build out the following template.
	pageinateHTML = "";
	pageCount = 1;
	for (var j = 1; j < pageinates; j++) {						// start at two because it (page 1) is included below.
		pageCount++;
		pageinateHTML += '<li><a href="#">' + pageCount + '</a> </li>';
	}

	$(".pagination ul").remove(); 				//remove the old page buttons
	pageinateHTML = '<ul><li><a class="active" href="#">1</a> '  + pageinateHTML + "</ul>";		// set page 1 as default active and insert the rest
	if (pageinates > 1) {
		$(".pagination").append(pageinateHTML);		// append to the end of pagination class
	}

}

//Given a starting page number build the corresponding HTML and load it.
// const setHTMLSection = (pageNumber, thisItemsArray) => {
function setHTMLSection(pageNumber, thisItemsArray) {		// to make the exceeds, I will need to pass in an array also. because the search feature will build a temp of matcing names.
	startingItem = (pageNumber - 1) * itemsPerPage;
	endingItem = startingItem + itemsPerPage;
	thisHTML = '';

	// account for a partial page.
	if (endingItem > thisItemsArray.length) {		
		endingItem = thisItemsArray.length;		 
	}  

	for ( var k = startingItem; k < endingItem; k++) {
		thisHTML += thisItemsArray[k]['Html'];		
	}
	dItem.innerHTML = thisHTML;				

}

function realTimeSearch() {	
	partialItemsArray = [];										// empty out the array
	itemName = $("input").val().toLowerCase();					// get the item name search value
	for (var l = 0; l < fullItemsArray.length; l++) {				// look at the entire array
		if (fullItemsArray[l]["Name"].indexOf(itemName) >= 0) {		// if a match is found
			partialItemsArray.push(fullItemsArray[l]);				// add to this array
		} 
	}

	if (partialItemsArray.length < 1) {						// no rows returned
		dItem.innerHTML = eItemssNone;					// set error message and then focus on search field.
		document.querySelector(".list-search > input").focus();
		$(".error").css({ "color": "red"});
		$(".pagination ul").remove(); 							//remove the old page buttons
	} else {
		setHTMLSection(1, partialItemsArray);					// call setHTMLSection to build the page.
		setPaginateButtons(partialItemsArray);
	}
}
//* --------------------- *//
//* Main logic section    *//
//* --------------------- *//

$('nav > ul').after( searchHTML);			// target only the h2 element in the page-header class for the Search html.
// Build the items array. 
for (var i = 0; i < $item.length; i++) {
	fullItemsArray.push( {Name: $itemsName[i].innerText.toLowerCase(), Html: $item[i].outerHTML});
}

setHTMLSection(1, fullItemsArray);				// grab the item information from the main array.
$(classItem).after(pageinateHTML);			// append to the correct HTML area
setPaginateButtons(fullItemsArray);				// create the buttons area from fullItemsArray.

//* --------------------- *//
//*  Events  section      *//
//* --------------------- *//

// event listener to respond to "Page" button clicks  change to  (event)
$('.pagination').click( function () {
	if (event.target.tagName == "A") { 
		$('.pagination li a').removeClass("active");						// remove the old class active from prior button
		if (itemName.length > 0 ) {
			setHTMLSection(event.target.innerHTML, partialItemsArray)
		} else {
			setHTMLSection(event.target.innerHTML, fullItemsArray);			// call setHTMLSection to build the page.
		}
		$(event.target).addClass("active");									// set this button to class active to highlight.
	}
});

// event listener to respond to "Search" button clicks
$('.list-search button').click( function(){
	partialItemsArray = [];										// empty out the array
	itemName = $("input").val().toLowerCase();									// get the item name search value
	for (var l = 0; l < fullItemsArray.length; l++) {				// look at the entire array
		if (fullItemsArray[l]["Name"].indexOf(itemName) >= 0) {	// if a match is found
			partialItemsArray.push(fullItemsArray[l]);			// add to this array
		} 
	}

	if (partialItemsArray.length < 1) {						// no rows returned
		dItem.innerHTML = eItemsnone;				// set error message and then focus on search field.
		document.querySelector(".list-search > input").focus();
		$(".error").css({ "color": "red"});
		$(".pagination ul").remove(); 							//remove the old page buttons
	} else {
		setHTMLSection(1, partialItemsArray);					// call setHTMLSection to build the page.
		setPaginateButtons(partialItemsArray);
	}

});

// event listener to detect a change in the search value
$(".list-search input").keyup( function (){
	if ( $("input").val().length === 0) {		// when the search input field is blanked out
		setHTMLSection(1, fullItemsArray);	// reset to the full item array.
		setPaginateButtons(fullItemsArray);	// reset the page buttons.
	} else {
		realTimeSearch();
	}
});