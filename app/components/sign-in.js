import Ember from 'ember';

export default Ember.Component.extend({
  
  actions: {
    
    showSignIn: function() {
      $('#login-box').dialog('open');
    }
  }
  
});
