/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',
    didUpdate: function() {
      setTimeout(function (){
        Ember.$(".select-chosen").trigger("chosen:updated");
      },100);
    }
});
