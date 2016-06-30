import DS from 'ember-data';

export default Ember.Controller.extend({
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
  actions: {
    updatePaymentType: function(type) {
      this.updatePaymentType(type);
    },
    showPaymentPlan: function() {
      $('#paymentplan_extrainfo').dialog('open');
      return false;
    }
  }
});