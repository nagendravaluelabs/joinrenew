/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    "use strict";
    this.controllerFor("application").set("model.class","no-sidebars page-primary-info personal-info-component");
  },
  resetController: function(controller, isExiting) {
      this._super.apply(this, arguments);

      if (isExiting) {
          controller.set("editContactInfo", false); // or whatever function you want to call
      }
  },
  model() {
    "use strict";
    return Ember.RSVP.hash({
      steps: [
        {
          "title": "Step 1. Primary information",
          "status": "step-active",
          "route": "primary-information"
        },
        {
          "title": "Step 2. Membership dues",
          "status": "",
          "route": "membership-dues"
        },
        {
          "title": "Step 3. Payment",
          "status": "",
          "route": "payment-information"
        }
      ]
    });
  },
  setMainClass: function (){
    "use strict";
    this.send("setMainClass");
  }
});
