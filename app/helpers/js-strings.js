/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global jQuery*/
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  "use strict";
  var result="";
  if (params.length === 2 && params[0] !== undefined && params[0] !== "") {
    if(params[1]==="lower") {
      result = params[0].toLowerCase();
    } else if(params[1]==="capitalize") {
      result = params[0].capitalize();
    } else if(params[1]==="upper") {
      result = params[0].toUpperCase();
    } else if(params[1]==="decodeEntities") {
      result = jQuery('<div>').html(params[0]).text();
    }
  }
  return result;
});
