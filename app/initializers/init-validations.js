/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from "ember";
var fieldValidations = Ember.Mixin.create({
  initValidations: function() {
    Ember.$(document).on("keydown", '.numbers-only', function (e) {
        "use strict";
        var key = e.charCode || e.keyCode || 0;
        return (
            key === 13 ||
            key === 8 ||
            key === 9 ||
            key === 46 ||
            (key >= 35 && key <= 40) ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105) 
        );
    });

    var specialKeys = [];
    specialKeys.push(8);   //Backspace
    specialKeys.push(9);   //Tab
    specialKeys.push(144); //Num Lock
      
    Ember.$(document).on("keypress", ".few-special-char", function (e) {
        "use strict";
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var ret = ((keyCode >= 32 && keyCode <= 35) || (keyCode >= 37 && keyCode <= 59) || (keyCode === 61) || (keyCode >= 63 && keyCode <= 125) || (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
        if (!ret) {
            if ($(this).next("label.error").length === 0) {
                $('<label class="error">Special Characters $, &lt;, &gt; not allowed</label>').insertAfter($(this));
            }
        } else {
            $(this).next("label.error").remove();
        }
        return ret;
    });

    Ember.$(document).on("keypress", '.no-special-char', function(e){
          "use strict";
          var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
          var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
          return ret;
    });
  },
  render: function () {
    "use strict";
    this._super();
    this.initValidations();
  },
  activate: function() {
    "use strict";
    this._super.apply(this, arguments);
    Ember.run.schedule("afterRender", this, function () {
      this.initValidations();
    });
  }
});

export function initialize() {
  Ember.Route.reopen(fieldValidations);
}

export default {
  name: 'field-validations',
  initialize: initialize
};