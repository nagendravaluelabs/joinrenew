/*global jQuery*/
/*global $*/
import Ember from 'ember';

export default Ember.Component.extend({
    isLoggedin: false,
    didInsertElement() {
      this._super(...arguments);
      $('#login-box').dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false,
        width: $(window).width() > 500 ? 550 : '90%',
        title: '',
        responsive: true,
        closeText: 'X',
        show: false,
        hide: false,
        close: function() {
          $('#sign-In').validate().resetForm();
        }
      });
      $(window).resize(function() {
        $("#login-box").dialog("option", "width", $(window).width() > 500 ? 550 : '90%');
      });
    },
    actions: {
      signIn: function () {
        this.set("isLoggedin", true);
        this.get('router').transitionTo('renew-verify-membership');
      },
      signOut: function () {
        this.set("isLoggedin", false);
        this.get('router').transitionTo('index');
      },
      showSignIn: function() {
        $('#login-box').dialog('open');
      }        
    }
});

jQuery.validator.setDefaults({
    ignore: [],
    errorPlacement: function (error, element) {
        if (element.hasClass("chosen-select")) {
            error.insertAfter($(element).next(".chosen-container"));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        if ($(element).hasClass("chosen-select")) {
            $(element).next(".chosen-container").addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
        }
    },
    unhighlight: function (element, errorClass, validClass) {
        if ($(element).hasClass("chosen-select")) {
            $(element).next(".chosen-container").addClass(validClass).removeClass(errorClass);
        } else {
            $(element).addClass(validClass).removeClass(errorClass);
        }
    },
    invalidHandler: function (event, validator) {
        var scrollTo;
        if ($(validator.errorList[0].element).hasClass("chosen-select")) {
            scrollTo = $(validator.errorList[0].element).next(".chosen-container").offset().top - 50;
        } else {
            scrollTo = $(validator.errorList[0].element).offset().top - 50;
        }
        $("html, body").animate({"scrollTop": scrollTo + "px"}, 1000);
    }
});