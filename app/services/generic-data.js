/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  generic: "",
  routing: Ember.inject.service('-routing'),
  statesData: Ember.inject.service('states-data'),
  init: function () {
    "use strict";
    var self= this;
    self._super(...arguments);
    if(localStorage.aiaGenericData !== undefined) {
      var statesDataObj, genericData;
      statesDataObj = {};
      genericData = JSON.parse(localStorage.aiaGenericData);
      self.set("generic", genericData);
      statesDataObj["be685760-5492-4ba3-b105-868e2010fa34"] = Ember.getWithDefault(genericData, "states.CANADA", {});
      statesDataObj["bc4b70f8-280e-4bb0-b935-9f728c50e183"] = Ember.getWithDefault(genericData, "states.UNITED STATES", {});
      self.get("statesData").set("data", statesDataObj);
    } else {
      Ember.$('.ajax-spinner').show();
      Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=generic`).then(function(data){
        if(typeof data.errormessage === "undefined") {
          self.set("generic", data);
          localStorage.aiaGenericData = JSON.stringify(data);
          var statesDataObj = {};
          statesDataObj["be685760-5492-4ba3-b105-868e2010fa34"] = Ember.getWithDefault(data, "states.CANADA", {});
          statesDataObj["bc4b70f8-280e-4bb0-b935-9f728c50e183"] = Ember.getWithDefault(data, "states.UNITED STATES", {});
          self.get("statesData").set("data", statesDataObj);
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