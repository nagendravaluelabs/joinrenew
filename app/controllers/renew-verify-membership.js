/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global Ember*/

export default Ember.Controller.extend({
  addressData: Ember.inject.service('user-data'),
  address: "",  
  addressObserver: function (){
    "use strict";
    var addressData = this.get("addressData");
    if (typeof addressData.data !== "undefined") {
      if(typeof addressData.data.chapter.local) {
        this.set("address", addressData.data.chapter.local);
      } else if (typeof addressData.data.chapter.state) {
        this.set("address", addressData.data.chapter.state);
      } else if (typeof addressData.data.chapter.national) {
        this.set("address", addressData.data.chapter.national);
      }		  
	  if (addressData.data.membership){
        this.set("renewMailLink","https://aia.hbp.com/assets/pdf/"+addressData.data.membership.memberid+".pdf");		  
	  }
	  if (addressData.data.membership.membershipstatus !== 'Active')	 {
        this.set("dipslayFlag", "display:none");
    }   
	  this.set("changeMembershipLink", " https://aiad8dev.prod.acquia-sites.com/sites/default/files/2016-07/2016%20Associate%20to%20Architect%20Form.pdf");
	  
	  this.set("changeChapterLink", " https://aiad8dev.prod.acquia-sites.com/sites/default/files/2016-07/2016%20Chapter%20Transfer%20Request%20Form.pdf");	
    }	
  }.observes("addressData.data")
});