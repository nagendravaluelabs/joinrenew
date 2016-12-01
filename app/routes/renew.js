/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    "use strict";
    this.controllerFor("application").set("model.class","no-sidebars page-renew");
  },
	setupController: function(controller) {
		this._super.apply(this, arguments);
		controller.updateController();
	},
  model(){
    "use strict";
    return Ember.RSVP.hash({
      page: {
        "body": "<h2>Nearly 88,000 members, <br> over 250 chapters, <br> 1 you.</h2><p>Your vision is unique.  Your work is distinctive. Your career path is your own. We're excited to see where you're going&#8212;and we can help you get there.</p>",
        "field_aia_image": "images/ForrestHuismanAssocAIA@2x.jpg",
        "title": "Renew"
      },
      benefits: {}
    });
  }
});
