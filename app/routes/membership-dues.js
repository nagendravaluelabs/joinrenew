import Ember from 'ember';

export default Ember.Route.extend({
activate() {
  this.modelFor("application").class = "one-sidebar sidebar-first page-renew-membership-dues-page";
},
model(){
return Ember.RSVP.hash({
data : [
    {
        "title": "AIA National",
        "value": "$260",
		"id"   : "nationaldues",
		"class": "odd"
    },
    {
        "title": "AIA California Council",
        "value": "$210",
		"id"   : "statedues",
		"class": "even"
    },
    {
        "title": "AIA Los Angeles",
        "value": "$223",
		"id"   : "localdues",
		"class": "odd"
    },
    {
        "title": "2016 individual dues total",
        "value": "$750",
		"id"   : "indivdualdues",
		"class": "even"
    },
    {
        "title": "Supplemental dues",
        "value": "$0",
		"id"   : "suppdues",
		"class": "odd"
    }
]
 });
},	
});
