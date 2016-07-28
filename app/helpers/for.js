import Ember from 'ember';

export default Ember.Helper.helper(function([from, to, incr]) {
  var accum = [];
  for(var i = from; i <= to; i += incr){
     accum.push(i);
  }
  return accum;
});