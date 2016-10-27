/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $, moment*/
import Ember from 'ember';
export default Ember.Controller.extend({
  primaryData: Ember.inject.service('user-data'),
  genericData: Ember.inject.service('generic-data'),
  debitPayment: true,
  echeckPayment: false,
  installmentsPayment: false,
  subTotal: 0,
  total :0,
  supplyTotal:0,
  subTotalWithArchipac: 0,
  supplyTotalWithArchipac: 0,
  installNumber:3,
  installment: 0,
  paymentFailed: false,
  paymentValidate: false,
  maxInstallmentsProperty: function() {
    var installmentKeys, resultInstallmentKeys, currentDate, startDate, cutOFFDate;
    installmentKeys = this.getWithDefault("genericData.generic.installmentkeys", "", false);
    resultInstallmentKeys = 0;
    if(installmentKeys) {
      installmentKeys.forEach(function(value){
        currentDate = moment(moment().format("DD/MM/YYYY"),"DD/MM/YYYY");
        startDate = moment(moment(value.startdate).format("DD/MM/YYYY"), "DD/MM/YYYY");
        cutOFFDate = moment(moment(value.cutoffdate).format("DD/MM/YYYY"), "DD/MM/YYYY");
        if(currentDate.isBetween(startDate, cutOFFDate) || currentDate.isSame(startDate) || currentDate.isSame(cutOFFDate)
          ) {
            resultInstallmentKeys = value.ins_max_installments;
          }
      });
    }
    return resultInstallmentKeys;
  }.property("genericData.generic.installmentkeys"),
  init: function () {
      "use strict";
      this.calculateInstallments(this.get("installNumber"));
      this.subTotalObserves();
  },
  currentYear: function(){
    var date = new Date();
    var presentYear = date.getFullYear();
    return presentYear;
  }.property(),
  maxYearList: function(){
    var date = new Date();
    var presentYear = date.getFullYear();
    var maxYears = presentYear + 10;
    return maxYears;
  }.property(),
  subTotalObserves: function () {
    "use strict";
    var primaryData, subTotal, total, supplyTotal, archipacValue;
    primaryData = this.get("primaryData");
    subTotal = 0;
    total = 0;
    supplyTotal = 0;
    archipacValue = 0;
    if (primaryData.data !== "undefined" && primaryData.data !== "") {
      $.map(primaryData.data.invoice.dues, function (payment) {
        subTotal += parseFloat(payment.due);          
      });
      total  = parseFloat(subTotal) + 40; 

      if(typeof primaryData.data.supplementalDuesTotal !== undefined) {
        supplyTotal = parseFloat(subTotal) + parseFloat(primaryData.data.supplementalDuesTotal);
        total += parseFloat(primaryData.data.supplementalDuesTotal);
      }  
      total = parseFloat(total);
      this.set("subTotal", parseFloat(subTotal, 2));
      this.set("supplyTotal", parseFloat(supplyTotal, 2));
      archipacValue = (this.get("primaryData.data.paymentInfo.isArchiPAC")) ? 25 : 0;
      this.set("total", parseFloat(total, 2));
      //this.set("total", parseFloat(total+archipacValue, 2));
      this.set("supplyTotalWithArchipac", parseFloat(supplyTotal+archipacValue, 2));
      this.set("subTotalWithArchipac", parseFloat(subTotal+archipacValue, 2));
      
      this.calculateInstallments(this.get("installNumber"));
    }
  }.observes('primaryData.data', 'primaryData.data.paymentInfo.isArchiPAC'),       
  updatePaymentType: function(type) {
    "use strict";
    if (type === "Debit/Credit Card") {
      this.set("debitPayment", true);
      this.set("echeckPayment", false);
      this.set("installmentsPayment", false);
    } else if(type === "Electronic check") {
      this.set("debitPayment", false);
      this.set("echeckPayment", true);
      this.set("installmentsPayment", false);
    } else if(type === "EMI") {
      this.set("debitPayment", false);
      this.set("echeckPayment", false);
      this.set("installmentsPayment", true);
    } 
  },
  validatePaymentInfo: function () {
      "use strict";
      var self;
      self = this;
      self.paymentValidate = $("#form-card-payment").validate({
          rules:{
              cardName: {
                required: true,
                EcardNameValidate: true
              },
              cardNumber: {
                required: true,
                digits: true,
                creditcard: true
              },
              cardExpirationMonth: {
                required: true,
                digits: true,
                creditcardMonth: true
              },
              cardExpirationYear: {
                required: true, 
                digits: true,
                creditcardMonth: true
              },
              cardSecurityCode: {
               required: true,
               digits: true,
               minlength: 3,
               maxlength: 4
              },
              iagree_terms: {
                required: true
              }
          },
          messages: {
              cardName: {
                required: "First and last name on card are required"
              },
              cardNumber: {
                required: "Card number is required",
                digits: "Please enter a valid credit card number",
                creditcard: "Please enter a valid credit card number"
              },
              cardExpirationMonth: {
                required: function() {
                  if(Ember.$("#cardExpirationMonth").val() === "" && Ember.$("#cardExpirationYear").val() === "") {
                    return "Expiration month and year is required";
                  } else {
                    return "Expiration month is required";
                  }                  
                }
              },
              cardExpirationYear: {
                required: function() {
                  if(Ember.$("#cardExpirationMonth").val() === "" && Ember.$("#cardExpirationYear").val() === "") {
                    return "Expiration month and year is required";
                  } else {
                    return "Expiration year is required";
                  }                  
                }
              },
              cardSecurityCode: {
                required: "Security code is required",
                digits: "Please enter a valid CVV number",
                minlength: "Please enter at least 3 digits"
              },
              iagree_terms:{
                required: "You must agree to the terms and conditions"
              }
          },
          errorPlacement: function (error, element) {
            if (element.hasClass("chosen-select")) {
              error.insertAfter();
            } else if (element.hasClass("installment_iagree") || element.hasClass("iagree_terms")) { 
              error.insertAfter($(element).next("label"));
            } else if (element.is("#cardExpirationYear") || element.is("#cardExpirationMonth")) {
              let primaryData = self.get("primaryData");
              primaryData = primaryData.data;
              let selectedYear = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationYear", 0)); 
              let selectedMonth = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationMonth", 0));
              if((selectedYear && selectedMonth) || (!selectedYear && !selectedMonth)) {
                error.insertAfter($(element).closest("li").find("#group-expiration-error"));
              } else {
                error.insertAfter(element);
              }
            } else {
              error.insertAfter(element);
            }
          }
      });
      let primaryData = this.get("primaryData");
      primaryData = primaryData.data;
      let selectedYear = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationYear", 0)); 
      let selectedMonth = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationMonth", 0));
      if((selectedYear && selectedMonth) || (!selectedYear && !selectedMonth)) {
        self.paymentValidate.groups["cardExpirationMonth"] = "cardExpiry";
        self.paymentValidate.groups["cardExpirationYear"] = "cardExpiry";
      } else {
        self.paymentValidate.groups = {};
      }      
      return self.paymentValidate.form();
  },
  
  validateInstallmentAgreeInfo: function () {
    "use strict";
    var validate;
    validate = $("#install-agreement").validate({
      rules:{
          installment_iagree: {
            required: true
          }
      },
      messages: {
          installment_iagree:{
            required: "You must agree to the installments terms and conditions"
          }
      },
      errorPlacement: function (error, element) {
          if (element.hasClass("chosen-select")) {
              error.insertAfter();
          } else {
              if (element.hasClass("installment_iagree")) {                          
                error.insertAfter($(element).next("label"));
              }else {
                error.insertAfter(element);
              }                        
          }
      }
    });
    return validate.form();
  },
  calculateInstallmentsObserves: function() {
    "use strict";
    this.calculateInstallments(this.get("installNumber"));
  }.observes("total"),
  calculateInstallments: function(value) {
    "use strict";
    var total = this.get("total");
    var installment;
    this.set('installNumber',value);
    var installNumber = value;		  
    //var totalForArchpacCal = this.get("primaryData.data.paymentInfo.isArchiPAC") ? parseFloat(total-25) : parseFloat(total);
    installment = parseFloat(total/installNumber);
    this.set("installment", parseFloat(installment.toFixed(2)));
  },
  saveRenewData : function () {
    var formattedSaveData, paymentSaveCallback, paymentError, self;
    self = this;
    formattedSaveData = self.get("primaryData").reMapJSON(self.get("primaryData").data);
    paymentSaveCallback = self.get("primaryData").saveRenewInfoToNF(formattedSaveData);
    paymentSaveCallback.then(function(response){
      if(response.Success === "true" && response.InvoiceNumber !== "") {
        localStorage.removeItem('aiaUserInfo');
        self.transitionToRoute('complete');
      } else {
        paymentError = Ember.getWithDefault(response, "errormessage", false);
        paymentError = (paymentError) ? paymentError : "There was a problem while processing your payment. To learn more, please contact us: 1-800-242-3837, option 2 or memberservices@aia.org. We regret any inconvenience.";
        self.set("paymentFailed", paymentError);
        $("html, body").animate({scrollTop: "100px"}, 1000);
      }
    });
  },
  resetPayments: function() {
    this.set("paymentFailed", false);
    this.set("installmentsPayment", false);
    this.set("debitPayment", true);
    
  },
  actions: {
    installmentsValidator: function(){
      var self = this;
      if(self.paymentValidate) {
        let primaryData = this.get("primaryData");
        primaryData = primaryData.data;
        let selectedYear = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationYear", 0)); 
        let selectedMonth = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationMonth", 0));
        if((selectedYear && selectedMonth) || (!selectedYear && !selectedMonth)) {
          self.paymentValidate.groups["cardExpirationMonth"] = "cardExpiry";
          self.paymentValidate.groups["cardExpirationYear"] = "cardExpiry";
          $('#cardExpirationMonth').removeClass('error').next('label.error').remove();
          $('#cardExpirationYear').removeClass('error').next('label.error').remove();
        } else {
          self.paymentValidate.groups = {};
          $('#cardExpiry-error').remove();
        }
        self.paymentValidate.element("#cardExpirationMonth");
        self.paymentValidate.element("#cardExpirationYear");
      }
    },
    install : function(value){
      "use strict";
      this.calculateInstallments(value);
    },
    updatePaymentType: function(type) {
      "use strict";
      this.updatePaymentType(type);
    },
    showPaymentPlan: function() {
      "use strict";
      $('#paymentplan_extrainfo').dialog('open');
      return false;
    },
    callValidations: function() {
      "use strict";
      var cardValidation, installmentsValidation;
      installmentsValidation = !this.get("installmentsPayment");
      cardValidation = this.validatePaymentInfo();
      if(this.get("installmentsPayment")){
        installmentsValidation = this.validateInstallmentAgreeInfo();
      }
      if(cardValidation && installmentsValidation) {
          this.saveRenewData();
      }
    },
    validatePaymentElectronicInfo: function () {
        "use strict";
        var validate;
        validate = $("#form-electronic-check").validate({
            rules:{
                accountName:{
                   required: true,
                   EcardNameValidate: true
                },
                bankroutingNumber:{
                   required: true,
                   digits: true,
                   minlength: 7
                },
                accountNumber: {
                   required: true,
                   digits: true
                },
                check_iagree_terms:{
                  required: true
                }
            },
            messages: {
                accountName:{
                  required: "First and last name on account are required",
                  lettersonly: "Please enter a name of the Account Holder"
                },
                bankroutingNumber:{
                  required: "Bank routing number is required",
                  digits: "Please enter a valid routing number",
                  minlength : "Please enter a valid routing number"
                },
                accountNumber:{
                  required:"Account number is required",
                  digits: "Please enter a valid account number"
                },
                check_iagree_terms:{
                  required: "You must agree to the terms and conditions"
                }
            },
            errorPlacement: function (error, element) {
                if (element.hasClass("chosen-select")) {
                    error.insertAfter();
                } else {
                    if (element.hasClass("check_iagree_terms")) {                          
                      error.insertAfter($(element).next("label"));
                    }else {
                      error.insertAfter(element);
                    }                        
                }
            }
        });
        if(validate.form()) {
            this.saveRenewData();
        } 
    } 
  }
});