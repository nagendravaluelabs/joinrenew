import Ember from 'ember';

export default Ember.Helper.helper(function([value]) {
  value = parseFloat(value);
  return value.toFixed(2);
});