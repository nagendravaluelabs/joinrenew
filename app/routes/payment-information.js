/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
/*global window*/

import Ember from 'ember';

export default Ember.Route.extend({
    activate() {
      "use strict";
      this.controllerFor("application").set("model.class", "no-sidebars page-sign-up page-sign-up-payment");
      this._super();
      Ember.run.schedule("afterRender", this, function () {
        $("#payment-accordion").accordion({
            collapsible: true,
            icons: {'header': 'defaultIcon', 'activeHeader': 'selectedIcon'},
            active: false,
            heightStyle: "content"
        });
        $('#paymentplan_extrainfo').dialog({
          modal: true,
          autoOpen: false,
          draggable: false,
          resizable: false,
          width: $(window).width() > 500 ? 450 : '90%',
          title: '',
          responsive: true,
          closeText: 'Close',
          appendTo: "#main-content.page-sign-up-payment #paymentplan_modal",
          show: false,
          hide: false
        });
        $(window).resize(function () {
          $("#paymentplan_extrainfo").dialog("option", "width", $(window).width() > 500 ? 450 : '90%');
        });
        $('body').on("click", ".ui-widget-overlay", function () {
          $("#paymentplan_extrainfo").dialog("close");
        });
      });
  },
	setupController: function(controller) {
		this._super.apply(this, arguments);
    var paymentsData = localStorage.aiaUserInfo;
    if(paymentsData !== undefined) {
      paymentsData = JSON.parse(paymentsData);
      paymentsData.paymentInfo = {};
      paymentsData.paymentInfo.paymentType = "Debit/Credit Card";
      paymentsData.paymentInfo.isArchiPAC = 1;
      localStorage.aiaUserInfo = JSON.stringify(paymentsData);
      controller.get("primaryData").saveUserData(paymentsData);
    }
		controller.resetPayments();
	},
	resetController: function(controller, isExiting) {
		this._super.apply(this, arguments);
		if (isExiting) {
			controller.resetPayments();
		}
	},
  model(){
    "use strict";
    return Ember.RSVP.hash({
      steps: [
        {
          "title": "Step 1. Primary information",
          "status": "step-done",
          "route": "primary-information"
        },
        {
          "title": "Step 2. Membership dues",
          "status": "step-done",
          "route": "membership-dues"
        },
        {
          "title": "Step 3. Payment",
          "status": "step-active",
          "route": "payment-information"
        }
      ],
      role: "Architect",
      payments: [
        {
          "title": "AIA National",
          "annual": "260.00",
          "proRated":"195.00"	
        },
        {
          "title": "AIA New York State",
          "annual": "84.00",
          "proRated":"63.00"
        },
        {
          "title": "AIA New York State",
          "annual": "84.00",
          "proRated":"93.75"	
        }
      ],
      Total :[
        {
          "title": "Total due",
          "value": "351.75"
        }
      ]
    });		
  }
});
