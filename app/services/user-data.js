/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import inject from 'ember-service/inject';
export default Ember.Service.extend({
  data: "",
  auth: inject(),
  janrain: inject(),
  init: function() {
    var self= this;
    self._super(...arguments);
  },
  setUserData: function(userkey) {
    var self= this;
    if(userkey !== null && userkey !== "") {
      Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=${userkey}`).then(function(data){
        var error = false;
        if(typeof data !== undefined) {
          if(typeof data.errormessage === "undefined") {
            if(typeof data.invoice !== "undefined") {
              if(typeof data.invoice.proforma !== "undefined" && parseInt(data.invoice.proforma) === 1) {
                self.set("data", data);
              } else {
                error = "invalid-invoice";
              }
            } else {
              error = "invalid-invoice";
            }
          } else {
            error = "invoice-unavailable";
          }
        } else {
          error = "invoice-unavailable";
        }
        if(error) {
          self.get('auth').set("authState", error);
          self.get('auth').logout();
          self.get('janrain').doLogout();
        }
      },function(){
        self.get('auth').set("authState", "invoice-unavailable");
        self.get('auth').logout();
        self.get('janrain').doLogout();
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
