/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export function explodeImplode(params) {
  "use strict";
  var string, stringToArray, delimiter, glue;
  string = (!params[0]) ? "" : params[0];
  delimiter = (!params[1]) ? "," : params[1];
  glue = (!params[2]) ? "\n" : params[2];
  stringToArray = string.split(delimiter);
  return stringToArray.join(glue);
}

export default Ember.Helper.helper(explodeImplode);