/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: [],
  setStateData: function(value, update) {
    var data = this.get("data");
    data[value] = update;
    this.set("data", data);
  },
  getStateData: function(value) {
    var stateData, self;
    self = this;
    stateData = self.get("data");
    if(Ember.get(stateData, value) !== undefined) {
      return {'type': "data", info: stateData[value]};
    } else {
      this.setStateData(value, []);
      return {'type': "response", info: Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=state&key=${value}`)};
    }
  },
  updateChosen: function (){
    "use strict";
    setTimeout(function (){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});