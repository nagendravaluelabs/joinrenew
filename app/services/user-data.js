/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: "",
  init: function () {
    "use strict";
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    $.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=AF65438E-A745-4477-B32D-DD241B705CC8`).then(function(data){
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
