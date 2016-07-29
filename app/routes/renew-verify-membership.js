/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    "use strict";
    this.controllerFor("application").set("model.class","no-sidebars renew-verify-membership");
  }
});
