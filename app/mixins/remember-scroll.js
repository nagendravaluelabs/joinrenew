/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global jQuery*/
/*global window*/

import Ember from 'ember';

export default Ember.Mixin.create({
  scrollToTop: function() {
    "use strict";
    var scrollTop = jQuery(window).scrollTop();
    if ( scrollTop > 10 ) {
      jQuery("html, body").animate({"scrollTop": "0px"}, 0);
    }
    jQuery("html, body").on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function (){
      jQuery("html, body").stop(true, true);
    });
  }
});