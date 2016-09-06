import Ember from 'ember';
import inject from 'ember-service/inject';
var AuthMixin = Ember.Mixin.create({
  auth: inject(),
  verfiyUserAuth: function() {
    this.authVerify();
  }.observes("auth.user"),
  beforeModel: function() {
    this.authVerify();
  },
  authVerify: function() {    
    let currenRoute  = this.routeName;
    let authRoutes = ["renew-verify-membership", "primary-information", "membership-dues", "payment-information", "thankyou-page", "complete"];
    let noLogouts = ["invalid-invoice", "invoice-unavailable"];
    let routeIgnoreKeys = ["not-authorized", "invoice-invalid", "invalid-janrain", "invoice-unavailable"];
    let nonAuthRoutes = ["renew", "index"];
    if(currenRoute !== "application") {
      let authUser = this.get("auth").get("user");
      let authState = this.get("auth").get("authState");
      let authUserInfo = localStorage.aiaUserInfo;
      authUserInfo = (authUserInfo !== undefined) ? JSON.parse(authUserInfo) : {};
      if(authRoutes.indexOf(currenRoute) !== -1) {
        if(!authUser || noLogouts.indexOf(authState) !== -1) {
          localStorage['route'] = "renew-verify-membership";
          if(authState === "logout") {
            this.transitionTo('/renew');
            localStorage['route'] = "";
          } else if(authState === "invalid-invoice") {
            this.transitionTo('/invoice-invalid');
            localStorage['route'] = "";
          } else if(authState === "invoice-unavailable") {
            this.transitionTo('/invoice-unavailable');
            localStorage['route'] = "";
          } else if(authState === "no-access") {
            this.transitionTo('/invalid-janrain');
            localStorage['route'] = "";
          } else {
            this.transitionTo('/not-authorized');
          }
        }
      } else if(nonAuthRoutes.indexOf(currenRoute) !== -1) {
        if(authUser && authUser.access_token !== undefined) {
          let transitionToRoute = localStorage['route'];
          if(transitionToRoute) {
            this.transitionTo(transitionToRoute);
          } else {
            if(Ember.getWithDefault(authUserInfo, "invoice", false)) {
              this.transitionTo("renew-verify-membership");
            } else if(authState === 'invalid-invoice') {
              this.transitionTo("invoice-invalid");
            } else if(authState === 'invoice-unavailable') {
              this.transitionTo("invoice-unavailable");
            } else if(authState === "logout") {
              this.transitionTo('/renew');
              localStorage['route'] = "";
            }
          }
          localStorage['route'] = "";
        } else if(authUser && authUser.length>0 && authUser.indexOf("invalid") !== -1) {
          this.transitionTo("invalid-janrain");
        }
      } else if(routeIgnoreKeys.indexOf(currenRoute) !== -1) {
        if(authUser && authUser.access_token !== undefined) {
          let transitionToRoute = localStorage['route'];
          if(transitionToRoute) {
            this.transitionTo(transitionToRoute);
            localStorage['route'] = "";
          } else {
            if(Ember.getWithDefault(authUserInfo, "invoice", false)) {
              this.transitionTo("renew-verify-membership");
            } else if(authState === 'invalid-invoice') {
              this.transitionTo("invoice-invalid");
            } else if(authState === 'invoice-unavailable') {
              this.transitionTo("invoice-unavailable");
            } else if(authState === "logout") {
              this.transitionTo('/renew');
              localStorage['route'] = "";
            }
          }
        } else {
          if(authState === "logout") {
            this.transitionTo('/renew');
            localStorage['route'] = "";
          }
        }
      } else {
        localStorage['route']="";
      }
    }
  }
});
export default ({
  name: 'route-auth',
  initialize() {
    Ember.Route.reopen(AuthMixin);
  }
});
