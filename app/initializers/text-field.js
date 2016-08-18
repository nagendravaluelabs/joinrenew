/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';
export default {
  name: 'text-field-configuration',
  initialize: function() {
    Ember.TextField.reopen({
      init: function() {
        this._super();
        var self = this;
        // bind attributes beginning with 'data-'
        Ember.keys(this).forEach(function(key) {
          if (key.substr(0, 5) === 'data-') {
            self.get('attributeBindings').pushObject(key);
          }
        });
      }
    });
  }
};