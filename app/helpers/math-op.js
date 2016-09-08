/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  "use strict";
  var result="";
  if (params.length === 3 && params[0] !== undefined && params[0] !== "") {
    switch (params[2]) {
      case '+': {
        result = (parseFloat(params[0]) + parseFloat(params[1]));
        break;
      }
    } 
  }
  return result;
});
