import Ember from 'ember';
import inject from 'ember-service/inject';
export default Ember.Component.extend({
  classNames: ['login-control'],
  auth: inject(),
  janrain: inject(),
  actions: {
    logout() {
      this.get('auth').logout();
      this.get('janrain').doLogout();
    }
  }
});
