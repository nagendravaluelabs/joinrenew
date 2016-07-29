/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  "use strict";
  return params[0] === params[1];
});
