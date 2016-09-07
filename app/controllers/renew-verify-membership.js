/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global Ember*/

export default Ember.Controller.extend({
  addressData: Ember.inject.service('user-data'),
  init: function() {
    this.setAddress();
  },
  address: "",
  setAddress: function (){
    "use strict";
    var addressData = this.get("addressData");
    if (typeof addressData.data !== "undefined" && addressData.data !== "" && typeof addressData.data.chapter !== "undefined") {
      if(typeof addressData.data.chapter.local !== "undefined") {
        this.set("address", addressData.data.chapter.local);
      } else if (typeof addressData.data.chapter.state !== "undefined") {
        this.set("address", addressData.data.chapter.state);
      } else if (typeof addressData.data.chapter.national !== "undefined") {
        this.set("address", addressData.data.chapter.national);
      }		  
      if (typeof addressData.data.membership !== "undefined"){
          this.set("renewMailLink","https://aia.hbp.com/assets/pdf/"+addressData.data.membership.memberid+".pdf");
		  if (typeof addressData.data.membership.membershipstatus !== "undefined" && addressData.data.membership.membershipstatus !== 'Active')	 {
			  this.set("dipslayFlag", "display:none");
		  } 
      }  
      this.set("changeMembershipLink", " http://aia.org");
      this.set("changeChapterLink", " http://aia.org");
    }	
  },
  addressObserver: function (){
    this.setAddress();
  }.observes("addressData.data")
});