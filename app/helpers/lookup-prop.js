import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Helper.helper(function(params) {
  return params[0][params[1]+params[2]];
});
