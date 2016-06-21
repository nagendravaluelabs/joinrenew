import Ember from 'ember';

export function nl2br(params) {
  return params[0].replace(/(\r\n|\n|\r)/gm, '<br />');
}

export default Ember.Helper.helper(nl2br);
