/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';
export default Ember.Component.extend({
    tagName: '',
    genericData: Ember.inject.service('generic-data'),
    actions: {
        setWorkStateStatus: function (value) {
            "use strict";
          this.sendAction('setWorkStateStatus', value);
        },
        setHomeStateStatus: function (value) {
            "use strict";
          this.sendAction('setHomeStateStatus', value);
        }
    }
});