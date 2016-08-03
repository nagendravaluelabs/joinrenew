import Ember from 'ember';
import Controller from 'ember-controller';
import inject from 'ember-service/inject';
import computed from 'ember-computed';

const { observer } = Ember;

export default Controller.extend({
  auth: inject(),
  returnToHome: computed(function() {
    return () => this.transitionToRoute('index', { queryParams: { previewMode: 'page' }});
  }),
  afterEmailVerification: observer('emailVerificationCode', function() {
    if (this.get('emailVerificationCode') && window.janrain) {
      window.janrain.capture.ui.start();
    }
  })
});
