import DS from 'ember-data';
import Ember from "ember";
import rememberScroll from "../mixins/remember-scroll";
const {$} = Ember;
export default Ember.Controller.extend(rememberScroll, {
    isRenewSummary: true,
    isQuestionnarie: false,
    isTotalRenew: false,
    isDuesCalculator: false,
    duesData: Ember.inject.service('user-data'),
    updateDuesPage: function (renew, questionnaire, total, dues, event) {
        "use strict";
        this.set("isRenewSummary", renew);
        this.set("isQuestionnarie", questionnaire);
        this.set("isTotalRenew", total);
        this.set("isDuesCalculator", dues);
        $("#error-container").hide();
        this.scrollToTop();
    },
    valueObserver: function () {
        "use strict";
        this._super();
        Ember.run.schedule("afterRender", this, function () {
            $("#accordion").accordion({
                collapsible: true,
                icons: {'header': 'defaultIcon', 'activeHeader': 'selectedIcon'},
                active: false,
                heightStyle: "content"
            });
        });
    }.observes('isDuesCalculator'),
    totalDues: 0,
    totalDuesObserver: function() {
      var totalDues=0;
      var duesData = this.get("duesData");
      if(typeof duesData.data.invoice != "undefined") {
        Ember.$.each(duesData.data.invoice.dues, function(key, value){
          totalDues += parseInt(value.due);
        });
        this.set("totalDues", totalDues.toFixed(2));
      }
    }.observes('duesData.data'),
    actions: {
        questionnaireMembershipduesNext: function (event) {
            "use strict";
            this.updateDuesPage(false, true, false, false, event);
        },
        membershipduesNext: function (event) {
            "use strict";
            var isDuesCalculator, isQuestionnarie, questionnaire;
            isDuesCalculator = this.get("isDuesCalculator");
            isQuestionnarie = this.get("isQuestionnarie");
            if (isQuestionnarie) {
                questionnaire = parseInt($('input[name="questionnaire"]:checked').val());
                if (questionnaire === 1) {
                    this.updateDuesPage(false, false, true, false, event);
                } else if (questionnaire === 2) {
                      var validate;
                      validate = $("#questionnaireUserform").validate({
                          rules: {
                            questionnaire_membername: {
                              required: function () {
                                  return $("#edit-questionnaire-2").is(":checked");
                              },
                              lettersonly: true
                            },
                            questionnaire_memberid: {
                              required: function () {
                                  return $("#edit-questionnaire-2").is(":checked");
                              },
                              digits: true
                            }
                          },
                          messages: {
                            questionnaire_membername: "Please enter Member name",
                            questionnaire_memberid: {
                              required: "Please enter Member ID",
                              digits: "Please enter only numerics"
                            }
                          }
                      });
                      if(validate.form()) {
                          this.updateDuesPage(false, false, true, false, event);
                      }
                } else {
                    this.updateDuesPage(false, false, false, true, event);
                }
            } else if (isDuesCalculator) {
                var validate;
                validate = $("#dues-calculator").validate({
                  errorLabelContainer : "#error-container"
                });
                if(validate.form()) {
                    this.updateDuesPage(false, false, true, false, event);
                }
            }
        },
        membershipduesPrev: function (event) {
            "use strict";
            var isDuesCalculator, isQuestionnarie, isTotalRenew;
            isDuesCalculator = this.get("isDuesCalculator");
            isTotalRenew = this.get("isTotalRenew");
            isQuestionnarie = this.get("isQuestionnarie");
            if (isQuestionnarie) {
                this.updateDuesPage(true, false, false, false, event);
            } else if (isDuesCalculator || isTotalRenew) {
                this.updateDuesPage(false, true, false, false, event);
            }
            return false;
        },
        calculateSum: function (e) {
            "use strict";
            var self, value, amount, total, suppduesTotal;
            self = $(e.currentTarget);
            suppduesTotal = 0;
            value = (self.val() !== '')
                ? parseInt(self.val())
                : 0;
            amount = parseInt(self.data("localAmount"));
            total = parseFloat(value * amount).toFixed(2);
            self.closest("h3").find(".totals").find(".totalnum").html("$ " + total);
            self.closest("h3").find(".totals").find(".totalnum").data("total", total);
            self.closest("h3").next("div").find(".totalnum").html("$ " + total);
            $("#accordion").find("h3 .totalnum").each(function () {
                suppduesTotal = parseInt(suppduesTotal) + parseInt($(this).data('total'));
            });
            $("#suppdues_totalamount").html("$ " + parseFloat(suppduesTotal).toFixed(2));
        },
        payNow: function () {
            var validate;
            validate = $("#form-totalRenew").validate({
              messages: {
                licensed_architect: "You must agree to the affidavit"
              },
              errorLabelContainer : "#error-container"
            });
            if(validate.form()) {
                this.transitionToRoute('payment-information');
            }
        }
    }
});

$(document).on("change", 'input[name="questionnaire"]', function () {
    
    if (parseInt($(this).val()) === 2) {
        $(".questionnaire-userform").removeClass("hidden");
    } else {
        $(".questionnaire-userform").addClass("hidden");
    }
});

$(document).on("keydown", '.numbers-only', function (e) {
    "use strict";
    var key = e.charCode || e.keyCode || 0;
    return (
        key === 13 ||
        key === 8 ||
        key === 9 ||
        key === 46 ||
        (key >= 35 && key <= 40) ||
        (key >= 48 && key <= 57) ||
        (key >= 96 && key <= 105)
    );
});