/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  generic: "",
  routing: Ember.inject.service('-routing'),
  init: function () {
    "use strict";
    var self= this;
    self._super(...arguments);
    if(localStorage.aiaGenericData !== undefined) {
      self.set("generic", JSON.parse(localStorage.aiaGenericData));
    } else {
      Ember.$('.ajax-spinner').show();
      Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=generic`).then(function(data){
        if(typeof data.errormessage === "undefined") {
          self.set("generic", data);
          localStorage.aiaGenericData = JSON.stringify(data);
        } else {
          self.get("routing").transitionTo("invoice-unavailable");
        }
      });
    }
  },
  updateChosen: function (){
    "use strict";
    setTimeout(function (){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("generic")
});