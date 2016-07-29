/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export function nl2br(params) {
  "use strict";
  return params[0].replace(/(\r\n|\n|\r)/gm, '<br />');
}

export default Ember.Helper.helper(nl2br);
