import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Service.extend({
  data: [],
  init: function() {
    var self= this;
    self._super(...arguments);
    $('.ajax-spinner').show();
    Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=d785d4f3-f8fd-4571-83d4-f79fa93468bb`).then(function(data){
      self.set("data", data);
    })    
  }
});
