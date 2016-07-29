/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global jQuery*/
/*global $*/
/*global window */
import Ember from 'ember';

export default Ember.Component.extend({
    isLoggedin: false,
    didInsertElement() {
        "use strict";
        this._super(...arguments);
        Ember.$('#login-box').dialog({
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
            close: function () {
                $('#sign-In').validate().resetForm();
            }
        });
        $(window).resize(function () {
            $("#login-box").dialog("option", "width", $(window).width() > 500? 550 : '90%');
        });
    },
    actions: {
        signIn: function () {
            "use strict";
          this.set("isLoggedin", true);
          this.get('router').transitionTo('renew-verify-membership');
        },
        signOut: function () {
            "use strict";
          this.set("isLoggedin", false);
          this.get('router').transitionTo('index');
        },
        showSignIn: function () {
            "use strict";
            $('#login-box').dialog('open');
        }    
    }
});

jQuery.validator.setDefaults({
    ignore: [],
    errorPlacement: function (error, element) {
        "use strict";
        if (element.hasClass("chosen-select")) {
            error.insertAfter($(element).next(".chosen-container"));
        } else {
            error.insertAfter(element);
        }
    },
    highlight: function (element, errorClass, validClass) {
        "use strict"; 
        if ($(element).hasClass("chosen-select")) {
            $(element).next(".chosen-container").addClass(errorClass).removeClass(validClass);
        } else {
            $(element).addClass(errorClass).removeClass(validClass);
        }
    },
    unhighlight: function (element, errorClass, validClass) {
        "use strict";
        if ($(element).hasClass("chosen-select")) {
            $(element).next(".chosen-container").addClass(validClass).removeClass(errorClass);
        } else {
            $(element).addClass(validClass).removeClass(errorClass);
        }
    },
    invalidHandler: function (event, validator) {
        "use strict";
        var scrollTo;
        if ($(validator.errorList[0].element).hasClass("chosen-select")) {
            scrollTo = $(validator.errorList[0].element).next(".chosen-container").offset().top - 50;
        } else {
            scrollTo = $(validator.errorList[0].element).offset().top - 50;
        }
        $("html, body").animate({"scrollTop": scrollTo + "px"}, 1000);
    }
});