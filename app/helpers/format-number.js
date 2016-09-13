/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function ([value]) {
  "use strict";
  if(value === undefined || value === null || value === ""  || isNaN(value)) {
    value = 0;
  }
  return value;
});