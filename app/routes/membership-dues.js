import Ember from 'ember';
export default Ember.Route.extend({
activate() {
  this.controllerFor("application").set("model.class","one-sidebar sidebar-first page-renew-membership-dues-page");
  this._super();
  Ember.run.schedule("afterRender", this, function () {
    
  });
},
model(){
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
