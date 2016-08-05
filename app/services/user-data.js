/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: "",
  init: function() {
    var self= this;
    self._super(...arguments);
  },
  setUserData: function(userkey) {
    var self= this;
    if(userkey !== null && userkey !== "") {
      Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=${userkey}`).then(function(data){
        self.set("data", data);
      });
    } else {
      self.set("data", "");
    }    
  },
  updateChosen: function(){
    setTimeout(function(){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});
