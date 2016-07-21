import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: [],
  init: function() {
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=C3EA6EE0-78AD-4FDC-8A3E-AF3162E3098B`).then(function(data){
      self.set("data", data);
    })    
  }
});
