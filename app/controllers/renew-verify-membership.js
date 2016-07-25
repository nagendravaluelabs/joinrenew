import DS from 'ember-data';

export default Ember.Controller.extend({
  addressData: Ember.inject.service('user-data'),
  address: "",  
  addressObserver: function(){
    var addressData = this.get("addressData");
    if(typeof addressData.data != "undefined") {
      if(typeof addressData.data.chapter.local) {
        this.set("address", addressData.data.chapter.local);
      } else if(typeof addressData.data.chapter.state) {
        this.set("address", addressData.data.chapter.state);
      } else if(typeof addressData.data.chapter.national) {
        this.set("address", addressData.data.chapter.national);
      }	
	  
	  if(addressData.data.membership){
		  this.set("renewMailLink","https://aia.hbp.com/assets/pdf/3"+addressData.data.membership.memberid);		  
	  }else{
		  
	  }
	  if(addressData.data.membership.membershipstatus == 'Terminated')
	    this.set("dipslayFlag", "display:none");  
    }	
  }.observes("addressData.data")
});