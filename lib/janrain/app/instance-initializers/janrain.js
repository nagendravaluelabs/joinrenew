import Ember from 'ember';
import ENV from '../config/environment';

const { $, RSVP } = Ember;

function resetLoginForm() {
  $('.capture_btn').css({ display: 'inline-block' });
  $('.capture_processing').css({ display: 'none' });
}

function doOnLogin(result) {
  localStorage.identity = '';
  resetLoginForm();
  let janrainService = this.lookup('service:janrain');
  let janrainToken = localStorage.janrainCaptureToken;

  Ember.run(() => {
    janrainService.doLogin(janrainToken, result);
  });
}

export function initialize(applicationInstance) {
  let janrainService = applicationInstance.lookup('service:janrain');
  janrainService.initialize(applicationInstance);

  //this is a debugging function to replicate janrain login event on our dev boxes
  window.janrainLogin = doOnLogin.bind(applicationInstance);

  // janrainWidgetOnLoad is a special function that gets called as soon as the the
  // Janrain widget is loaded on the page. Attach all of your event handlers
  // within this function.
  window.janrainWidgetOnload = () => {
    window.janrain.events.onCaptureFederateNoLogin.addHandler(doOnLogin.bind(applicationInstance));
    window.janrain.events.onCaptureLoginSuccess.addHandler(doOnLogin.bind(applicationInstance));
  };
}

export default {
  name: 'janrain',
  initialize
};