/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';
import i18N from '../config/i18N';
export default Ember.Helper.helper(function (params) {
  "use strict";
  var result = params[1];
  if(typeof i18N[params[0]] !== "undefined" && typeof i18N[params[0]][params[1]] !== "undefined" && typeof i18N[params[0]][params[1]][params[2]] !== "undefined") {
    result = i18N[params[0]][params[1]][params[2]];
  }
  return result;
});
