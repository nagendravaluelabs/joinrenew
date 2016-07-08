import Ember from 'ember';

export default Ember.Component.extend({
  
  actions: {
    
    showSignIn: function() {
      $('#login-box').dialog('open');
    },
    signInRequired : function(){
      var signIn;
      signIn = $('#sign-In').validate({
        rules: {
          signInEmailAddress:{
            required: true,
            email: true
          },
          currentPassword:{required: true}
        },
        messages: {
          signInEmailAddress:{required: "Email address is required."},
          currentPassword:{required: "Password is required."}
        },
        invalidHandler: function (event, validator) {
          
        }
      })
      if(signIn.form()) {
        $('#login-box').dialog('close');
        this.get('router').transitionTo('renew-verify-membership');
      }
    }
  }
});