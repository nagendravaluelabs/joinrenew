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
  doLogin(token, authorizationCode) {
    var authParams, authReqData, janrainProfileData, tokenParams, tokenReqData, self;
    self = this;
    if (!token) {
      self.get("auth").set("authState", "skip");
      self.get('auth').logout();
      self.doLogout();
      return; 
    }
    janrainProfileData = localStorage.janrainCaptureProfileData;
    janrainProfileData = JSON.parse(janrainProfileData);
    if(!janrainProfileData) { return; }
    if(authorizationCode) {
      tokenParams = {
        "redirect_uri": "http://vcap.me/social-login/token",
        "code": authorizationCode,
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
      }).then((json) => {
        if(typeof json.access_token !== "undefined") {
          localStorage['aia-user'] = JSON.stringify(json);
          self.fetchUserInformation(json.access_token);
        } else {
          $('.ajax-spinner').hide();
          self.get('auth').set("authState", "no-access");
          self.get('auth').set("user", ["invalid"]);
          self.get('auth').logout();
          self.doLogout();
        }
      });
    } else {
      let authInfo = localStorage['aia-user'];
      authInfo = (!authInfo) ? false : JSON.parse(authInfo);
      if(typeof authInfo.access_token !== "undefined") {
        self.fetchUserInformation(authInfo.access_token);
      } else {
        $('.ajax-spinner').hide();
        self.get('auth').set("authState", "no-access");
        self.get('auth').set("user", ["invalid"]);
        self.get('auth').logout();
        self.doLogout();
      }      
    }
  },
  fetchUserInformation(access_token) {
    var fetchParams, fetchData, self, userData;
    self = this;
    userData = localStorage["aiaUserInfo"];
    userData = (userData) ? userData : false;
    if(!userData) {
      fetchParams = {
        type_name: "user",
        attributes: '["nfIndividualKey"]',
        max_results: 1
      };
      fetchParams = $.param( fetchParams );
      fetchData = {
        method: "POST",
        headers: {
          "Authorization": "OAuth "+access_token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: fetchParams
      };
      fetch(`${ENV.AIA_API_URL}/entity`, fetchData).then(response => {
        if(response.status === 200) {
          return response.json().then(function(json){
            $('.ajax-spinner').hide();
            if(Ember.getWithDefault(json, "result.nfIndividualKey", false)) {
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
    } else {
      self.get("userData").setUserData(userData.userKey);
      self.get("auth").set("authState", "");
      self.reloadRoute();
    }
    let auth = self.get('auth');
    self.reloadRoute();
    let loginCallback = self.get('_loginCallback');
    if (loginCallback && typeof loginCallback === 'function') {
      loginCallback();
    }
  },
  doLogout(isForceLogout) {
    isForceLogout = (typeof isForceLogout === "undefined") ? false : isForceLogout;
    this.get("userData").setUserData(null);
    if(!isForceLogout) {
      localStorage.removeItem('aia-user');
      localStorage.removeItem('aiaUserInfo'); 
      localStorage.removeItem('aiaGenericData'); 
      localStorage.removeItem('janrainLastAuthMethod'); 
      localStorage.removeItem('janrainLastAuthMethod_Expires'); 
      if (window.janrain && window.janrain.capture && window.janrain.capture.ui) {
        window.janrain.capture.ui.endCaptureSession();
      }
    }
    this.reloadRoute();
  }
});