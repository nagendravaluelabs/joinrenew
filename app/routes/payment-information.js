import Ember from 'ember';

export default Ember.Route.extend({
activate() {
	this.controllerFor("application").set("model.class","no-sidebars page-sign-up page-sign-up-payment");
	this._super();
	Ember.run.schedule("afterRender",this,function() {
	  
	  $("#accordion").accordion({
		  collapsible: true,
		  icons: {'header': 'defaultIcon', 'activeHeader': 'selectedIcon'},
		  active: false,
		  heightStyle: "content"
		});
	});
},
model(){
return Ember.RSVP.hash({
steps: [
	{
	  "title": "Step 1. Primary information",
	  "status": "",
	  "route": "primary-information"
	},
	{
	  "title": "Step 2. Membership dues",
	  "status": "",
	  "route": "membership-dues"
	},
	{
	  "title": "Step 3. Payment",
	  "status": "step-active",
	  "route": "payment-information"
	}
  ],
	
payment : [
{
	"title" : "AIA National",
	"annual": "260.00",
	"Pro-rated":"195.00"	
},
{
	"title" : "AIA New York State",
	"annual": "84.00",
	"Pro-rated":"63.00"		
},
{
	"title" : "AIA New York State",
	"annual": "84.00",
	"Pro-rated":"63.00"	
}
],	
subTotal:[
{
	"title": "Subtotal due",
	"value": "351.75"

}
],
Total :[ 
{
	"title": "Total due",
	"value": "351.75"
}
],
});		
}	
});
