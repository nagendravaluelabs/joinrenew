/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from "ember";
import rememberScroll from "../mixins/remember-scroll";
const {$} = Ember;
export default Ember.Controller.extend(rememberScroll, {
    isRenewSummary: true,
    isQuestionnarie: false,
    isTotalRenew: false,
    isDuesCalculator: false,
    duesData: Ember.inject.service('user-data'),
    updateDuesPage: function (renew, questionnaire, total, dues) {
        "use strict";
        this.set("isRenewSummary", renew);
        this.set("isQuestionnarie", questionnaire);
        this.set("isTotalRenew", total);
        this.set("isDuesCalculator", dues);
        Ember.$("#error-container").hide();
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
    init: function () {
        "use strict";
        this.totalDuesFunc();
        this.hasSupplementalDues();
    },
    supplementalDuesTotal: 0,
    supplementalTotalDues: 0,
    totalDues: 0,
    hasSupplementalDues: function () {
        "use strict";
        var duesData = this.get("duesData");
        if (duesData.data !== "undefined" && duesData.data !== "") {
            if (duesData.data.invoice.issupplementaldues === 0) {
                this.updateDuesPage(false, false, true, false);
            }
        }
    },
    hasSupplementalDuesObserver: function () {
        "use strict";
        this.hasSupplementalDues();
    }.observes('duesData.data'),
    totalDuesObserver: function () {
        "use strict";
        this.totalDuesFunc();
    }.observes('duesData.data'),
    totalDuesFunc: function () {
        "use strict";
        var totalDues = 0;
        var duesData = this.get("duesData");
        if (duesData.data !== "undefined" && duesData.data !== "") {
            if (typeof duesData.data.invoice !== "undefined") {
                Ember.$.each(duesData.data.invoice.dues, function (key, value) {
                    totalDues += parseInt(value.due);
                });
                this.set("totalDues", totalDues.toFixed(2));
            }
        }
    },
    supTotalDuesObserver: function () {
        "use strict";
        this.supTotalDuesFunc();
    }.observes('totalDues', 'supplementalDuesTotal'),
    supTotalDuesFunc: function () {
        "use strict";
        var totalDues = this.get("totalDues");
        var supplementalDuesTotal = this.get("supplementalDuesTotal");
        this.set("supplementalTotalDues", parseInt(supplementalDuesTotal) + parseInt(totalDues));
    },
    supplementalList: function () {
        "use strict";
        var list = [];
        list[list.length] = {"id": "nonmember", "text": "Non AIA Member architects"};
        list[list.length] = {"id": "member", "text": "AIA Member architects", "isRequired": true};
        list[list.length] = {"id": "associate", "text": "AIA Associates"};
        list[list.length] = {"id": "technical", "text": "Technical staff"};
        list[list.length] = {"id": "other", "text": "Other staff"};
        return list;
    }.property(),
    actions: {
        questionnaireMembershipduesNext: function () {
            "use strict";
            this.updateDuesPage(false, true, false, false);
        },
        membershipduesNext: function () {
            "use strict";
            var isDuesCalculator, isQuestionnarie, questionnaire;
            isDuesCalculator = this.get("isDuesCalculator");
            isQuestionnarie = this.get("isQuestionnarie");
            if (isQuestionnarie) {
                questionnaire = parseInt($('input[name="questionnaire"]:checked').val());
                if (questionnaire) {
                    $("#error-container").html('').hide();
                    $('input[name="questionnaire"]').removeClass("error");
                    $('input[name="questionnaire"]').off("change");
                    if (questionnaire === 1) {
                        this.updateDuesPage(false, false, true, false);
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
                        if (validate.form()) {
                            this.updateDuesPage(false, false, true, false);
                        }
                    } else {
                        this.updateDuesPage(false, false, false, true);
                    }
                } else {
                    $("#error-container").html('<label class="error">Please select an option from the questionnaire</label>').show();
                    $('input[name="questionnaire"]').addClass("error");
                    $("html, body").animate({scrollTop: ($('input[name="questionnaire"]').offset().top - 50) + "px"}, 1000);
                    $('input[name="questionnaire"]').on("change", function () {
                        $("#error-container").html('').hide();
                        $('input[name="questionnaire"]').removeClass("error");
                    });
                }
            } else if (isDuesCalculator) {
                var validateDuesCalc;
                validateDuesCalc = $("#dues-calculator").validate({
                    errorLabelContainer: "#error-container"
                });
                if (validateDuesCalc.form()) {
                    this.updateDuesPage(false, false, true, false);
                }
            }
        },
        membershipduesPrev: function () {
            "use strict";
            var isDuesCalculator, isQuestionnarie, isTotalRenew;
            isDuesCalculator = this.get("isDuesCalculator");
            isTotalRenew = this.get("isTotalRenew");
            isQuestionnarie = this.get("isQuestionnarie");
            if (isQuestionnarie) {
                this.updateDuesPage(true, false, false, false);
            } else if (isDuesCalculator || isTotalRenew) {
                this.updateDuesPage(false, true, false, false);
            }
            this.set("supplementalDuesTotal", 0);
            return false;
        },
        calculateSum: function (e) {
            "use strict";
            var self, value, amount, total, suppduesTotal;
            self = $(e.currentTarget);
            suppduesTotal = 0;
            value = (self.val() !== '') ? parseInt(self.val()) : 0;
            amount = parseInt(self.data("localAmount"));
            total = parseFloat(value * amount).toFixed(2);
            self.closest("h3").find(".totals").find(".totalnum").html("$ " + total);
            self.closest("h3").find(".totals").find(".totalnum").data("total", total);
            self.closest("h3").next("div").find(".totalnum").html("$ " + total);
            $("#accordion").find("h3 .totalnum").each(function () {
                suppduesTotal = parseInt(suppduesTotal) + parseInt($(this).data('total'));
            });
            //$("#suppdues_totalamount").html("$ " + parseFloat(suppduesTotal).toFixed(2));
            this.set("supplementalDuesTotal", suppduesTotal);
        },
        payNow: function () {
            "use strict";
            var validate;
            validate = $("#form-totalRenew").validate({
                messages: {
                    licensed_architect: "You must agree to the affidavit"
                },
                errorLabelContainer: "#error-container"
            });
            if (validate.form()) {
                this.transitionToRoute('payment-information');
            }
        }
    }
});

Ember.$(document).on("change", 'input[name="questionnaire"]', function () {
    "use strict";
    if (parseInt($(this).val()) === 2) {
        $(".questionnaire-userform").removeClass("hidden");
    } else {
        $(".questionnaire-userform").addClass("hidden");
    }
});

Ember.$(document).on("keydown", '.numbers-only', function (e) {
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

var specialKeys = [];
specialKeys.push(8);   //Backspace
specialKeys.push(9);   //Tab
specialKeys.push(144); //Num Lock
  
$(document).on("keypress", ".few-special-char", function (e) {
    "use strict";
    var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
    console.log(keyCode);
    var ret = ((keyCode >= 32 && keyCode <= 35) || (keyCode >= 37 && keyCode <= 59) || (keyCode === 61) || (keyCode >= 63 && keyCode <= 125) || (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
    if (!ret) {
        if ($(this).next("label.error").length === 0) {
            $('<label class="error">Special Characters $, &lt;, &gt; not allowed</label>').insertAfter($(this));
        }
    } else {
        $(this).next("label.error").remove();
    }
    return ret;
});