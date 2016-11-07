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
    var self;
    self = this;
    if (!token) {
      self.get("auth").set("authState", "skip");
      self.get('auth').logout();
      self.doLogout();
      return; 
    }
    $('.ajax-spinner').show();
    return fetch(`${ENV.AIA_REST_URL}/janrain/token/exchange/${token}`).then(response => {
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
      $('.ajax-spinner').hide();
      if(json && typeof json.access_token !== "undefined" && typeof json['netforum-id'] !== "undefined") {
        let netforumId = json['netforum-id'];
        localStorage['aia-user'] = JSON.stringify(json);
        self.get("userData").setUserData(netforumId);
        self.get("auth").set("authState", "");
        self.reloadRoute();
      } else {
        self.get("auth").set("authState", "no-access");
        self.get("auth").set("user", ["invalid"]);
        self.get('auth').logout();
        self.doLogout();
      }
      let auth = self.get('auth');
      auth.reloadUser();
      self.reloadRoute();
      let loginCallback = self.get('_loginCallback');
      if (loginCallback && typeof loginCallback === 'function') {
        loginCallback();
      }
    });
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