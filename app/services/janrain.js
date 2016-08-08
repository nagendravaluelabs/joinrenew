/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import Service from 'ember-service';
import fetch from 'ember-network/fetch';
import inject from 'ember-service/inject';
import RouteRefresherMixin from '../mixins/route-refresher';

export default Service.extend(RouteRefresherMixin, {
  auth: inject(),
  userData: Ember.inject.service('user-data'),

  setLoginCallback(callback) {
    this.set('_loginCallback', callback);
  },
  doLogin(token) {
    var authParams, authReqData, janrainProfileData, tokenParams, tokenReqData, self;
    self = this;
    if (!token) {
      self.get("auth").set("authState", "skip");
      self.get('auth').logout();
      self.doLogout();
      return; 
    }
    janrainProfileData = localStorage.janrainCaptureProfileData;
    if(!janrainProfileData) { return; }
    $('.ajax-spinner').show();
    janrainProfileData = JSON.parse(janrainProfileData);
    authParams = {
      "redirect_uri": "http://aiadev2.prod.acquia-sites.com/janrain_capture/oauth",
      "type_name": "user",
      "uuid": janrainProfileData.uuid
    };
    authParams = $.param( authParams );
    authReqData = {
      method: "POST",
      headers: {
        "Authorization": "Basic "+ btoa(ENV.AIA_API_CLIENT_ID+":"+ENV.AIA_API_SECRET),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: authParams
    };
    
    return fetch(`${ENV.AIA_API_URL}/access/getAuthorizationCode`, authReqData).then(response => {
      if (response.status === 200) {
        return response.json().then(function(authorization){
          if(typeof authorization.authorizationCode !== undefined) {
            tokenParams = {
              "redirect_uri": "http://aiadev2.prod.acquia-sites.com/janrain_capture/oauth",
              "code": authorization.authorizationCode,
              "grant_type": "authorization_code",
              "client_id": ENV.AIA_API_CLIENT_ID,
              "client_secret": ENV.AIA_API_SECRET
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
                self.get('auth').set("authState", "no-access");
                self.get('auth').set("user", ["invalid"]);
                self.get('auth').logout();
                self.doLogout();
                return {};
              }
            });
          } else {
            self.get('auth').logout();
          }
        });
      } else {
        self.get('auth').logout();
      }
    }).then((json) => {
      if(typeof json.access_token !== "undefined") {
        var fetchParams, fetchData;
        fetchParams = {
          type_name: "user",
          attributes: '["nfIndividualKey"]',
          max_results: 1
        };
        fetchParams = $.param( fetchParams );
        fetchData = {
          method: "POST",
          headers: {
            "Authorization": "OAuth "+json.access_token,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: fetchParams
        };
        fetch(`${ENV.AIA_API_URL}/entity`, fetchData).then(response => {
          if(response.status === 200) {
            return response.json().then(function(json){
              $('.ajax-spinner').hide();
              if(typeof json.result !== undefined && typeof json.result.nfIndividualKey !== undefined && json.result.nfIndividualKey!== null) {
                self.get("userData").setUserData(json.result.nfIndividualKey);
                self.get("auth").set("authState", "");
                self.reloadRoute();
              } else {
                self.get("auth").set("authState", "no-access");
                self.get("auth").set("user", ["invalid"]);
                self.get('auth').logout();
                self.doLogout();
              }
            });
          }  else {
            self.get("auth").set("authState", "no-access");
            self.get("auth").set("user", ["invalid"]);
            self.get('auth').logout();
            self.doLogout();
          }
        });
        localStorage['aia-user'] = JSON.stringify(json);
        let auth = self.get('auth');
        auth.reloadUser();
        self.reloadRoute();
        let loginCallback = self.get('_loginCallback');
        if (loginCallback && typeof loginCallback === 'function') {
          loginCallback();
        }
      } else {
        $('.ajax-spinner').hide();
        self.get('auth').set("authState", "no-access");
        self.get('auth').set("user", ["invalid"]);
        self.get('auth').logout();
        self.doLogout();
      }
    });
  },
  doLogout() {
    localStorage.removeItem('aia-user');
    this.get("userData").setUserData(null);
    if (window.janrain && window.janrain.capture && window.janrain.capture.ui) {
      window.janrain.capture.ui.endCaptureSession();
    }
    this.reloadRoute();
  }
});