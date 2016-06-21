import DS from 'ember-data';
import Ember from 'ember';
const { $ } = Ember;

export default Ember.Controller.extend({
  actions: {
    showPersonalInfo: function() {
      $('#personal-contact-container').removeClass('hidden');
      $('#read-only').addClass('hidden');
    }
  }
});
