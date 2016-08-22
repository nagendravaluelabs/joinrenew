/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global $*/
import Ember from 'ember';

export default Ember.Component.extend({
    /* tagName: "" */
    actions :{
    showArchipacDis: function () {
      "use strict";
      $('#archipac_disclaiminfo').dialog('open');
      return false;
    }
  } 
  
  
  
});

        
        