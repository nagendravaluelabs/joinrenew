import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    this.controllerFor("application").set("model.class","no-sidebars page-renew-verify-membership");
  }
});
