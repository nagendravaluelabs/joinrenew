import Ember from 'ember';
//import ENV from '../config/environment';
//import fetch from 'ember-network/fetch';
//const {$} = Ember;

export default Ember.Controller.extend({
    queryParams: ['url_type', 'code'],
    code: null,
    url_type: null,
    isForceLoggedOut: false,
    updateController: function() {
      if(localStorage.isForceLogout) {
        this.set("isForceLoggedOut", true);
        localStorage.removeItem('isForceLogout');
      } else {
        this.set("isForceLoggedOut", false);
      }
    },
    init: function() {
      this._super.apply(this, arguments);
      /*if(!localStorage.janrainCaptureToken) {
        Ember.run.schedule("afterRender", this, function () {
          if(this.get("url_type") && this.get("url_type") === "forgot") {
            var authCode, tokenParams, tokenReqData;
            authCode = this.get("code");
            if(authCode) {
              $('.ajax-spinner').show();
              tokenParams = {
                "redirect_uri": ENV.AIA_BASEURL+"?url_type=forgot",
                "code": authCode,
                "grant_type": "authorization_code"
              };
              tokenParams = $.param( tokenParams );
              tokenReqData = {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                body: tokenParams,
                mode: 'no-cors'
              };
              return fetch(`${ENV.AIA_API_URL}/oauth/token`, tokenReqData).then(response => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  return {};
                }
              }).then((json) => {
                $('.ajax-spinner').hide();
                if(typeof json.access_token !== "undefined") {
                  //console.log(json)
                  //resetPassword
                  window.janrain.capture.ui.createCaptureSession(json.access_token);
                  setTimeout(function(){
                      window.janrain.capture.ui.renderScreen("resetPassword");
                  },1000);
                } else {
                  setTimeout(function(){
                      window.janrain.capture.ui.renderScreen("resetPasswordRequestCode");
                  },1000);
                }
              });
            }
          }
        });
      }*/
    },
});