import Ember from 'ember';
import layout from "janrain/templates/components/using-janrain";
import computed from 'ember-computed';

/* global janrain */

export default Ember.Component.extend({
  tagName: '',
  layout,
  login() {
    janrain.capture.ui.modal.open();
  },
  enabled: computed(function() {
    return typeof window.janrain !== 'undefined';
  })
});
