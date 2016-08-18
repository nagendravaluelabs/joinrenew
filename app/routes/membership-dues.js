/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';
export default Ember.Route.extend({
activate() {
  "use strict";
  this.controllerFor("application").set("model.class","one-sidebar sidebar-first page-renew-membership-dues-page");
  this._super();
  Ember.run.schedule("afterRender", this, function () {
    
  });
},
setupController: function(controller) {
    this._super.apply(this, arguments);    
    var duesData = localStorage.aiaUserInfo;
    if(duesData !== undefined) {
      duesData = JSON.parse(duesData);
      duesData.membershipInfo = {};
      duesData.membershipInfo.persons = {};
      duesData.membershipInfo.amount = {};
      duesData.supplementalDuesTotal = 0;
      localStorage.aiaUserInfo = JSON.stringify(duesData);
      controller.get("duesData").saveUserData(duesData);
    }
    controller.resetSupplement();
},
resetController: function(controller, isExiting) {
    this._super.apply(this, arguments);

    if (isExiting) {
        controller.updateDuesPage(true, false, false, false); // or whatever function you want to call
    }
},
model(){
  "use strict";
return Ember.RSVP.hash({
  steps: [
	{
	  "title": "Step 1. Primary information",
	  "status": "step-done",
	  "route": "primary-information"
	},
	{
	  "title": "Step 2. Membership dues",
	  "status": "step-active",
	  "route": "membership-dues"
	},
	{
	  "title": "Step 3. Payment",
	  "status": "",
	  "route": "payment-information"
	}
  ]  
 });
}
});
