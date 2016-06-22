import DS from 'ember-data';
import Ember from 'ember';
const { $ } = Ember;

export default Ember.Controller.extend({
  editContactInfo: false,
  actions: {
    showPersonalInfo: function() {
      var value = this.get("editContactInfo");
      this.set("editContactInfo", !value);
    }
  }
});
