/*global moment*/
import Ember from 'ember';
const { $ } = Ember;

export function initialize(applicationInstance) {
  let creditcardMessage = "Invalid Card Expiry Date.";
  let creditcardMessageFn = function() {
    return creditcardMessage;
  };
  window.applicationInstanceObj = applicationInstance;
  $.validator.addMethod( "creditcardMonth", function() {
    creditcardMessage = "Invalid Card Expiry Date.";
    let controllerObj = window.applicationInstanceObj.lookup('controller:payment-information');
    let primaryData = controllerObj.get("primaryData.data");
    var paymentType,
        currentDateObj,
        currentMonth,
        currentYear,
        compareFromObj,
        compareToObj,
        selectedYear,
        selectedMonth,
        expiryDateObj,
        daysInMonth,
        expiryDaysInMonth;
        
    compareFromObj = {};
    
    paymentType = Ember.getWithDefault(primaryData, "paymentInfo.paymentType", "Debit/Credit Card");
    
    /*
      For Dev testing
      
      var currentDate = "31/12/2016";
      currentDateObj = moment(currentDate, "DD/MM/YYYY");
      currentMonth = moment(currentDate, "DD/MM/YYYY").format("MM");
      currentYear = parseInt(moment(currentDate, "DD/MM/YYYY").format("YYYY"));
      daysInMonth = moment(currentDate, "DD/MM/YYYY").daysInMonth();
    */
    
    currentDateObj = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY");
    currentMonth = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY").format("MM");
    currentYear = parseInt(moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY").format("YYYY"));
    daysInMonth = moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY").daysInMonth();
    
    compareFromObj.jan = moment("01/01/"+currentYear, "DD/MM/YYYY");
    compareFromObj.april = moment("30/04/"+currentYear,"DD/MM/YYYY");
    compareFromObj.oct = moment("01/10/"+currentYear, "DD/MM/YYYY");
    compareFromObj.dec = moment("31/12/"+currentYear, "DD/MM/YYYY");  
    
    compareToObj = moment(daysInMonth+"/"+currentMonth+"/"+currentYear,"DD/MM/YYYY");
    
    selectedYear = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationYear", 0)); 
    selectedMonth = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationMonth", 0));
    if(selectedYear && selectedMonth) {
      expiryDaysInMonth = moment(selectedMonth+"/"+selectedYear, "MM/YYYY").daysInMonth();
      expiryDateObj = moment(expiryDaysInMonth+"/"+selectedMonth+"/"+selectedYear, "DD/MM/YYYY");
      if(expiryDateObj.isBefore(currentDateObj)) {
        return false;
      }
      if(paymentType === "EMI"){
        if(currentDateObj.isSameOrBefore(compareFromObj.april)&& currentDateObj.isSameOrAfter(compareFromObj.jan)){
          compareToObj = moment("30/06/"+currentYear,"DD/MM/YYYY");
          creditcardMessage = "The expiration date on card should be a minimum 06/"+currentYear+" to pay through installments.";
        }
        else if(currentDateObj.isSameOrBefore(compareFromObj.dec) && currentDateObj.isSameOrAfter(compareFromObj.oct)){
          compareToObj = moment("30/06/"+(currentYear+1),"DD/MM/YYYY");
          creditcardMessage = "The expiration date on card should be a minimum 06/"+(currentYear+1)+" to pay through installments.";
        }
      }
      if(!expiryDateObj.isSameOrAfter(compareToObj)) {
        return false;
      }
    }
    return true;
  }, creditcardMessageFn);
  $.validator.addMethod( "EcardNameValidate", function( value, element ) {
    return this.optional( element ) || /^[^$<>\]+\s+[^$<>]+?([^$<>])*[^\ ]$/g.test( value );
  }, "Both the first and last name on card are required" );
}

export default {
  name: 'init-jquery-validations',
  initialize
};