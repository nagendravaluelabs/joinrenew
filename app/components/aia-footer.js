/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  list: [{
    "text": "&copy; " + ENV.AIA_NEXT_YEAR + " AIA",
    "route": false
  },
  {
    "text": "(800) AIA-3837",
    "route": false
  },
  {
    "text": "infocentral@aia.org",
    "route": "mailto:infocentral@aia.org"
  },
  {
    "text": "Privacy",
    "route": "https://www.aia.org/pages/22691-privacy-policy"
  }]
});
