import Ember from 'ember';

export function ifCond(params) {
  switch (params[2]) {
    case '==':
      return (params[0] === params[1]);
    case '===':
      return (params[0] === params[1]);
    case '!=':
      return (params[0] !== params[1]);
    case '!==':
      return (params[0] !== params[1]);
    case '<':
      return (params[0] < params[1]);
    case '<=':
      return (params[0] <= params[1]);
    case '>':
      return (params[0] > params[1]);
    case '>=':
      return (params[0] >= params[1]);
    case '&&':
      return (params[0] && params[1]);
    case '||':
      return (params[0] || params[1]);
    case '%':
      return (params[0] % params[1] === 0) ? true : false;
    default:
      return false;
  }
}

export default Ember.Helper.helper(ifCond);
