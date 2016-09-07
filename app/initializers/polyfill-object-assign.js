/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from "ember";
var polyfillObjectAssign = Ember.Mixin.create({
  initPolyfill: function() {
    if (typeof Object.assign !== 'function') {
      Object.assign = function(target) {
        'use strict';
        if (target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    }
  },
  render: function () {
    "use strict";
    this._super();
    this.initPolyfill();
  },
  activate: function() {
    "use strict";
    this._super.apply(this, arguments);
    Ember.run.schedule("afterRender", this, function () {
      this.initPolyfill();
    });
  }
});

export function initialize() {
  Ember.Route.reopen(polyfillObjectAssign);
}

export default {
  name: 'polyfill-object-assign',
  initialize: initialize
};