import Ember from 'ember';
const { $ } = Ember;

export default Ember.Component.extend({
  tagName: '',
  genericData: Ember.inject.service('generic-data'),
  actions: {
    setWorkStateStatus: function(value) {
      this.sendAction('setWorkStateStatus', value);
    },
    setHomeStateStatus: function(value) {
      this.sendAction('setHomeStateStatus', value);
    }
  }
});