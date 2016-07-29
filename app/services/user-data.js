/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: [],
  init: function () {
    "use strict";
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    $.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=C3EA6EE0-78AD-4FDC-8A3E-AF3162E3098B`).then(function(data){
      self.set("data", data);
    });    
  },
  updateChosen: function (){
    "use strict";
    setTimeout(function (){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});
