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
    hasDuesCalculcator: true,
    maxCapExceeded: false,
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
        this.resetSupplement();
    },
    supplementalDuesTotal: 0,
    supplementalTotalDues: 0,
    totalDues: 0,
    supptot:0,
    resetSupplement: function() {
      this.set("supplementalDuesTotal", 0);
      this.set("supplementalTotalDues", 0);
      this.set("maxCapExceeded", false);
      
      if(Ember.getWithDefault("duesData", "data.membershipInfo", false)) {
        var membershipInfo = {};
        membershipInfo.persons = {};
        membershipInfo.amount = {};
        this.set("duesData.data.membershipInfo", membershipInfo);
      }
    },
    hasSupplementalDues: function () {
        "use strict";
        var duesData, validDuesUser;
        validDuesUser = ["Architect", "Architect Fellow"];
        duesData = this.get("duesData");
        
        if (duesData.data !== "undefined" && duesData.data !== "") {
            if (duesData.data.invoice.issupplementaldues === 1 && validDuesUser.indexOf(duesData.data.membership.membershiptype) !== -1) {
                this.updateDuesPage(true, false, false, false);
                this.set("hasDuesCalculcator", true);
            } else {
                this.updateDuesPage(false, false, true, false);
                this.set("hasDuesCalculcator", false);
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
        var duesData = this.get("duesData");
        var totalDues = this.get("totalDues");
        var supplementalDuesTotal = this.get("supplementalDuesTotal");
        if (duesData.data !== "undefined" && duesData.data !== "") {
          duesData.data["supplementalDuesTotal"] = supplementalDuesTotal;
          this.get("duesData").set("data", duesData.data);
        }
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
                                    letterswithbasicpunc: true
                                },
                                questionnaire_memberid: {
                                    required: function () {
                                        return $("#edit-questionnaire-2").is(":checked");
                                    },
                                    digits: true
                                }
                            },
                            messages: {
                                questionnaire_membername: {
                                  required : "Member name is required",
                                  letterswithbasicpunc: "Please enter a valid member name"
                                },
                                questionnaire_memberid: {
                                    required: "Member ID number is required",
                                    digits: "Please enter a valid member ID number"
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
            var isDuesCalculator, isQuestionnarie, isTotalRenew, membershipInfo;
            isDuesCalculator = this.get("isDuesCalculator");
            isTotalRenew = this.get("isTotalRenew");
            isQuestionnarie = this.get("isQuestionnarie");
            membershipInfo = {};
            membershipInfo.persons = {};
            membershipInfo.amount = {};
            this.set("duesData.data.membershipInfo", membershipInfo);
            this.set("maxCapExceeded", false);
            if (isQuestionnarie) {
                this.updateDuesPage(true, false, false, false);
            } else if (isDuesCalculator || isTotalRenew) {
                this.updateDuesPage(false, true, false, false);
            }
            this.set("supplementalDuesTotal", 0);
            return false;
        },
        calculateSum: function (value, event) {
            "use strict";
            var self,
                amount,
                totalsKey,
                total,
                suppduesTotal,
                localAmount,
                stateAmount,
                tempKey,
                keyValue,
                duesData, 
                maxCap;
                duesData = this.get("duesData");
                maxCap = parseFloat(duesData.data.invoice.supplementaldues.state.max);
            self = this;
            suppduesTotal = 0;
            localAmount = parseFloat(event.target.dataset.localAmount);
            stateAmount = parseFloat(event.target.dataset.stateAmount);
            totalsKey = event.target.dataset.totals;
			localAmount = (isNaN(localAmount)) ? 0 : localAmount;
			stateAmount = (isNaN(stateAmount)) ? 0 : stateAmount;
            amount =localAmount+stateAmount;
            total = parseFloat(value * amount).toFixed(2);
            
            this.set("duesData.data.membershipInfo.amount."+totalsKey, total);            
            $("#accordion").find("h3 .inputpersons input").each(function () {
                tempKey = $(this).data('totals');
                keyValue = parseFloat(self.get("duesData.data.membershipInfo.amount."+tempKey));
                keyValue = (keyValue === undefined || isNaN(keyValue)) ? 0 : keyValue;
                suppduesTotal = parseFloat(suppduesTotal) + parseFloat(keyValue);
            });
            self.set("maxCapExceeded", false);
            if(maxCap > 0) {
              if(suppduesTotal > maxCap) {
                suppduesTotal = maxCap;
                self.set("maxCapExceeded", true);
              }              
            }
            self.set("supplementalDuesTotal", suppduesTotal);
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
                this.get("duesData").saveUserData(this.get("duesData").data);
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

$(document).on("keypress", '.no-special-char', function(e){
      "use strict";
      var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
      var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) !== -1 && e.charCode !== e.keyCode));
      return ret;
});
