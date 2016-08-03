/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    "use strict";
    return {
      class: ""
    };
  },
  actions: {
    setMainClass: function () {
      "use strict";
      var model = this.get('controller.model');
      model.class = "";
    }
  }
});
