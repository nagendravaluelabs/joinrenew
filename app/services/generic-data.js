import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  generic: [],
  init: function() {
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=generic`).then(function(data){
      self.set("generic", data);
    })    
  },
  updateChosen: function(){
    setTimeout(function(){
      $(".select-chosen").trigger("chosen:updated");
    },100)
  }.observes("generic")
});