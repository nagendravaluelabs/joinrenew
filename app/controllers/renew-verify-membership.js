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
    }
  }.observes("addressData.data")
});