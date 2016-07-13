import Ember from 'ember';
import ENV from '../config/environment';
export default Ember.Helper.helper(function(params) {
  var result;
  if(params[1]=="lower")
  {
    result = params[0].toLowerCase();
  }
  return result;
});
