/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global $*/
import Ember from 'ember';
export default Ember.Component.extend({
  didInsertElement() {
    "use strict";
    this._super(...arguments);
    $('#archipac_disclaiminfo').dialog({
      modal: true,
      autoOpen: false,
      draggable: false,
      resizable: false,
      width: $(window).width() > 850 ? 850 : '90%',
      title: 'ArchiPAC disclaimer',
      responsive: true,
      closeText: '',
      appendTo: "#main-content.page-sign-up-payment #archipac_dis_modal", 
      show: false,
      hide: false
    });
    $(window).resize(function () {
      $("#archipac_disclaiminfo").dialog("option", "width", $(window).width() > 850 ? 850 : '90%');
    });
    $('body').on("click", ".ui-widget-overlay", function () {
      $("#archipac_disclaiminfo").dialog("close");
    }); 
  },
  actions :{
    showArchipacDis: function () {
      "use strict";
      $('#archipac_disclaiminfo').dialog('open');
      return false;
    }
  }
});

        
        