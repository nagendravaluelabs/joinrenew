import Ember from 'ember';
import computed from 'ember-computed';
import layout from "session/templates/components/using-session";
import injectService from 'ember-service/inject';

export default Ember.Component.extend({
  tagName: '',
  classNames: ['idleDisplay'],
  userIdle: injectService(),
  layout,
  isIdle: computed.readOnly('userIdle.isIdle'),
  status: computed('isIdle', function () {
    let idleStatus = this.get('isIdle') ? false : true;
    if(idleStatus) {
      Ember.$("#modal-session-timeout").modal("show");
    }
    return idleStatus;
  })
});