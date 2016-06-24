/*jslint es6, this*/
import DS from 'ember-data';
import Ember from 'ember';
const {$} = Ember;

export default Ember.Controller.extend({
    editContactInfo: false,
    actions: {
        showPersonalInfo: function () {
            'use strict';
            var value = this.get("editContactInfo");
            this.set("editContactInfo", !value);
        }
    }
});
