/*jslint white:true, devel:true, es6:true, this:true, browser:true */

import Ember from 'ember';

export default Ember.Helper.helper(function([from, to, incr]) {
  "use strict";
  var accum = [];
  for(var i = from; i <= to; i += incr){
     accum.push(i);
  }
  return accum;
});