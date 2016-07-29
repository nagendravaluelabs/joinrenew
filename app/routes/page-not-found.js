/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global window*/

import Ember from 'ember';

export default Ember.Route.extend({
	redirect: function () {
    "use strict";
    var url = this.router.location.formatURL('/not-found');
    if (window.location.pathname !== url) {
      this.transitionTo('/not-found');
    }
  }
});
