import Ember from 'ember';
export default Ember.Route.extend({
activate() {
  this.controllerFor("application").set("model.class","one-sidebar sidebar-first page-renew-membership-dues-page");
  this._super();
  Ember.run.schedule("afterRender", this, function () {
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
  ],
	data : [
		{
			"title": "AIA National",
			"value": "260",
			"id"   : "nationaldues",
			"class": "odd"
		},
		{
			"title": "AIA California Council",
			"value": "210",
			"id"   : "statedues",
			"class": "even"
		},
		{
			"title": "AIA Los Angeles",
			"value": "223",
			"id"   : "localdues",
			"class": "odd"
		},
		{
			"title": "2016 individual dues total",
			"value": "750",
			"id"   : "indivdualdues",
			"class": "even"
		},
		{
			"title": "Supplemental dues",
			"value": "0",
			"id"   : "suppdues",
			"class": "odd"
		}
	],
 DuesCal : [
		{
			"title": "AIA National",
			"value": "260",
			"id"   : "nationaldues",
		},
		{
			"title": "AIA California Council",
			"value": "210",
			"id"   : "statedues",
		},
		{
			"title": "AIA Los Angeles",
			"value": "223",
			"id"   : "localdues",
		},
		{
			"title": "2016 individual dues total",
			"value": "720",
			"id"   : "indivdualdues",
		}
	],
 Supplemental : [
		{
			"title": "Non AIA Member architects",
			"class": "form-item-non-aia-member-persons",
			"label": "#persons:",
			"for"  : "edit-non-aia-member-persons",
			"id"   : "non_aia_member_persons",
			"name" : "non_aia_member_persons",
			"stateAmount" : "0.00",
			"localAmount" :"115.00"
		},
		{
			"title": "AIA Member architects",
			"class": "form-item-aia-member-persons",
			"label": "#persons:",
			"for"  : "edit-aia-member-persons",
			"id"   : "aia_member_persons",
			"name" : "aia_member_persons",
			"stateAmount" : "0.00",
			"localAmount" :"115.00",
			"isRequired" : true
		},
		
		{
			"title": "AIA Associates",
			"class": "form-item-associates-persons",
			"label": "#persons:",
			"for"  : "edit-associates-persons",
			"id"   : "associates_persons",
			"name" : "associates_persons",
			"stateamount" : "0.00",
			"localAmount" : "115.00"
		},
		{
			"title": "Technical staff",
			"class": "form-item-techstaff-persons",
			"label": "#persons:",
			"for"  : "edit-techstaff-persons",
			"id"   : "techstaff_persons",
			"name" : "techstaff_persons",
			"stateAmount" : "0.00",
			"localAmount" :"115.00"
		},
		
		{
			"title": "Other staff",
			"class": "form-item-otherstaff-persons",
			"label": "#persons:",
			"for"  : "edit-otherstaff-persons",
			"id"   : "otherstaff_persons",
			"name" : "otherstaff_persons",
			"stateAmount" : "0.00",
			"localAmount" :"115.00"
		},
		
	],
MembershipSide : [
				 {
					 "MemberID": "Non AIA Member architects",
					 "MembershipYear": "2016",
					 "MembershipType": "architect",
					 "PaymentDueDate": "01/15/2016",
					 "InvoiceNumber": "2009088960",
					 "National": "90",
					 "State": "79",
					 "Local": "80"
				 }
              ]
		
 });
}
});
