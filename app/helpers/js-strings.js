/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  "use strict";
  var result="";
  if (params.length === 2 && typeof params[0] !== "undefined") {
    if(params[1]==="lower")
    {
      result = params[0].toLowerCase();
    } else if(params[1]==="capitalize")
    {
      result = params[0].capitalize();
    }    
  }  
  return result;
});
