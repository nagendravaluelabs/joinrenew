import Ember from 'ember';
const { $ } = Ember;

export default Ember.Component.extend({
  tagName: '',
  countries: function() {
    var data = ["UNITED STATES", "CANADA", "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA", "ARGENTINA"];
    return data;
  }.property(),
  actions: {
    setWorkStateStatus: function(value) {
      this.sendAction('setWorkStateStatus', value);
    },
    setHomeStateStatus: function(value) {
      this.sendAction('setHomeStateStatus', value);
    }
  }
});