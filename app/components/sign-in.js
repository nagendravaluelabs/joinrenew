/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global $*/
import Ember from 'ember';

export default Ember.Component.extend({
  
  actions: {
    
    showSignIn: function() {
      "use strict";
      $('#login-box').dialog('open');
    },
    signInRequired : function(){
      "use strict";
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
        invalidHandler: function () {
          
        }
      });
      if(signIn.form()) {
        $('#login-box').dialog('close');
        this.get('router').transitionTo('renew-verify-membership');
      }
    }
  }
});