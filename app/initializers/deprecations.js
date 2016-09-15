/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from "ember";

export function initialize() {
  if (Ember.Debug && typeof Ember.Debug.registerDeprecationHandler === 'function') {
      Ember.Debug.registerDeprecationHandler((message, options, next) => {
          if (options && options.until && options.until !== '2.0.0') {
              return;
          }
          next(message, options);
      });
  }
}

export default {
  name: 'deprecations',
  initialize: initialize
};