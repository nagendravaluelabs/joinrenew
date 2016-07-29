/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  generic: [],
  init: function () {
    "use strict";
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    $.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=generic`).then(function(data){
      self.set("generic", data);
    });    
  },
  updateChosen: function (){
    "use strict";
    setTimeout(function (){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("generic")
});