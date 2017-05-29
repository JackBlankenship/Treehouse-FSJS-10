'use strict';
jQuery.validator.setDefaults({
  success: "valid"
});

$('form').validate({
  rules: {
    returned_on: {		// name of your field	
      required: true,
      dateISO: true
    }
  }
});

//* --------------------- *//
//*  Events  section      *//
//* --------------------- *//

$('form').submit(function (e) {

});