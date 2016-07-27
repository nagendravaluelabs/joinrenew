import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      class: ""
    };
  },
  actions: {
    setMainClass: function() {
      //this.set("model", {"class":"hello"});
      var model = this.get('controller.model');
      model.class = "hello";
    }
  }
});
