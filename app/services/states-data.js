import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: [],
  init: function() {
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=state&key=bc4b70f8-280e-4bb0-b935-9f728c50e183`).then(function(data){
      self.set("data", data);
    })    
  }
});