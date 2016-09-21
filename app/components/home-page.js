/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';
import inject from 'ember-service/inject';
export default Ember.Component.extend({
    auth: inject(),
    janrain: inject(),
    actions: {
        signIn: function () {
            "use strict";
            this.get('router').transitionTo('renew-verify-membership');
        }
    }
});
