/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function ([value]) {
  "use strict";
  value = parseFloat(value);
    return value.toFixed(2);
});