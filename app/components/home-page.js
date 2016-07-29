/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        signIn: function () {
            "use strict";
            this.get('router').transitionTo('renew-verify-membership');
        }
    }
});
