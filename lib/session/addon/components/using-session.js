/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global $*/
import Ember from 'ember';
import computed from 'ember-computed';
import layout from "session/templates/components/using-session";
import injectService from 'ember-service/inject';

export default Ember.Component.extend({
  tagName: '',
  classNames: ['idleDisplay'],
  didInsertElement() {
    "use strict";
    this._super(...arguments);
    $('#sessionTimer_info').dialog({
      modal: true,
      autoOpen: false,
      draggable: false,
      resizable: false,
      width: $(window).width() > 550 ? 500 : '90%',
      responsive: true,
      closeText: 'close',
      dialogClass:'session-timeout-dialog',
      show: false,
      hide: false
    });
    $(window).resize(function () {
      $("#archipac_disclaiminfo").dialog("option", "width", $(window).width() > 550 ? 500 : '90%');
    });
  },
  userIdle: injectService(),
  janrain: injectService(),
  auth: injectService(),
  layout,
  isIdle: computed.readOnly('userIdle.isIdle'),
  idleStatus: "active",
  sessionAutoTimer: undefined,
  status: computed('isIdle', function () {
    let idleStatus = this.get('isIdle') ? false : true;
    return idleStatus;
  }),
  init: function(){
    this._super(...arguments);
  },
  idleObserver: Ember.observer('isIdle', function () {
    let isIdle = this.get('isIdle') ? false : true;
    let idleStatus = this.get('idleStatus');
    let currentRoute = (this.get('container').lookup('controller:application').currentPath);
    let checkIdleForRoutes = ['renew-verify-membership', 'primary-information', 'membership-dues', 'payment-information'];
    if(idleStatus === "active" && checkIdleForRoutes.indexOf(currentRoute) !== -1) {
      if(!isIdle) {
        this.set('idleStatus', "inActive");
      }
    }
  }),
  idleStateObserver: Ember.observer('idleStatus', function () {
    let idleStatus = this.get('idleStatus');
    var self = this;
    if(idleStatus === "inActive") {
      Ember.$("#sessionTimer_info").dialog("open");
      this.get("auth").set("sessionState", false);
      self.sessionAutoTimer = Ember.run.later(function(){
        self.send("forceLogout");
      }, 10000);
    }
  }),
  actions: {
    closeSessionDialogue: function() {
      var self = this;
      self.set('idleStatus', "active");
      Ember.$("#sessionTimer_info").dialog("close");
      self.get("auth").set("sessionState", true);
      self.get("auth")._refreshOnWakeFromSleep();
      Ember.run.cancel(self.sessionAutoTimer);
      return false;
    },
    forceLogout: function() {
      Ember.run.cancel(this.sessionAutoTimer);
      this.set('idleStatus', "active");
      Ember.$("#sessionTimer_info").dialog("close");
      localStorage.isForceLogout = true;
      this.get('auth').logout();
      this.get('janrain').doLogout();
      return false;
    }
  }
});