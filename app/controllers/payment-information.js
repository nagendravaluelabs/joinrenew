import DS from 'ember-data';

export default Ember.Controller.extend({
   primaryData: Ember.inject.service('user-data'),
        debitPayment: true,
        echeckPayment: false,
        insallmentsPayment: false,
        subTotal: function() {
          var model = this.get("model");
          var subTotal = 0;
          $.map(model.payments, function(payment, v) {
            subTotal += parseFloat(payment.proRated);
          });
          return parseFloat(subTotal, 2);
        }.property(),
        updatePaymentType: function(type) {
          if(type === "Debit/Credit Card") {
            this.set("debitPayment", true);
            this.set("echeckPayment", false);
            this.set("insallmentsPayment", false);
          } else if(type === "Electronic check") {
            this.set("debitPayment", false);
            this.set("echeckPayment", true);
            this.set("insallmentsPayment", false);
          } else if(type === "EMI") {
            this.set("debitPayment", false);
            this.set("echeckPayment", false);
            this.set("insallmentsPayment", true);
          } 
        },
        validatePaymentInfo: function () {
            var validate;
            validate = $("#form-card-payment").validate({
                rules:{
                    cardName: {
                      required: true,
                      letterswithbasicpunc: true
                    },
                    cardNumber: {
                      required: true,
                      digits: true
                    },
                    cardExpirationMonth: {
                      required: true,
                      digits: true
                    },
                    cardExpirationYear: {
                      required: true, 
                      digits: true
                    },
                    cardSecurityCode: {
                     required: true,
                     digits: true,
                     minlength: 3,
                     maxlength: 4
                    },
                    iagree_terms:{
                      required: true,
                    }
                },
                messages: {
                    cardName: {
                      required: "Please enter name on credit card",
                      letterswithbasicpunc: "Invalid name on credit card"
                    },
                    cardNumber: {
                      required: "Card number is required",
                      digits: "Please enter a valid credit card number"
                    },
                    cardExpirationMonth: {
                      required: "Expiration month is required",
                    },
                    cardExpirationYear: {
                      required: "Expiration year is required",
                    },
                    cardSecurityCode: {
                      required: "Security code is required",
                      digits: "Please enter a value less than or equal to 4"
                    },
                    iagree_terms:{
                      required: "You must agree to the terms and conditions"
                    }
                }, 
                errorPlacement: function (error, element) {
                    if (element.hasClass("chosen-select")) {
                        error.insertAfter();
                    } else {
                        if (element.hasClass("installment_iagree") || element.hasClass("iagree_terms")) {                          
                          error.insertAfter($(element).next("label"));
                        }else {
                          error.insertAfter(element);
                        }                        
                    }
                }
            });
            if(validate.form()) {
               
            } 
        },
        
        validateInstallmentAgreeInfo: function () {
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
          if(validate.form()) {
            
          } 
        },
            
        actions: {
          updatePaymentType: function(type) {
            this.updatePaymentType(type);
          },
          showPaymentPlan: function() {
            $('#paymentplan_extrainfo').dialog('open');
            return false;
          },
          callValidations: function() {
            this.validatePaymentInfo();
            if(this.get("insallmentsPayment"))
              this.validateInstallmentAgreeInfo();
          },
          validatePaymentElectronicInfo: function () {
                  var validate;
                  validate = $("#form-electronic-check").validate({
                      rules:{
                          accountName:{
                             required: true
                          },
                          bankroutingNumber:{
                             required: true,
                             digits: true
                          },
                          accountNumber: {
                             required: true,
                             digits: true
                          },
                          check_iagree_terms:{
                            required: true,
                          }
                      },
                      messages: {
                          accountName:{
                            required: "Please enter name on account",
                            lettersonly: "Please enter a name of the Account Holder"
                          },
                          bankroutingNumber:{
                            required: "Bank routing number is required",
                            digits: "Please enter a valid routing number"
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
                      
                  } 
              } 
        }
  
  
  
});