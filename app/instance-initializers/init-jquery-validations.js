import Ember from 'ember';
import ENV from '../config/environment';

const { $, RSVP } = Ember;


export function initialize(applicationInstance) {
  let creditcardMessage = "Invalid expiration date.";
  let creditcardMessageFn = function() {
    return creditcardMessage;
  };
  window.applicationInstanceObj = applicationInstance;
  $.validator.addMethod( "creditcardMonth", function() {
    creditcardMessage = "Invalid expiration date.";
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
        expiryDateObj;
        
    compareFromObj = {};
    
    paymentType = Ember.getWithDefault(primaryData, "paymentInfo.paymentType", "Debit/Credit Card");
    
    currentDateObj = moment();
    currentMonth = moment().format("MM");
    currentYear = parseInt(moment().format("YYYY"));
    
    compareFromObj.jan = moment("01/01/"+currentYear, "DD/MM/YYYY");
    compareFromObj.april = moment("30/04/"+currentYear,"DD/MM/YYYY");
    compareFromObj.oct = moment("01/10/"+currentYear, "DD/MM/YYYY");
    compareFromObj.dec = moment("31/12/"+currentYear, "DD/MM/YYYY");  
    
    compareToObj = moment("01/"+currentMonth+"/"+currentYear,"DD/MM/YYYY");
    
    selectedYear = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationYear", 0)); 
    selectedMonth = parseInt(Ember.getWithDefault(primaryData, "paymentInfo.ExpirationMonth", 0));  
    expiryDateObj = moment("02/"+selectedMonth+"/"+selectedYear, "DD/MM/YYYY");
    if(expiryDateObj.isBefore(currentDateObj)) {
      return false;
    }
    if(paymentType === "EMI"){
      if(currentDateObj.isSameOrBefore(compareFromObj.april)&& currentDateObj.isSameOrAfter(compareFromObj.jan)){
        compareToObj = moment("01/06/"+currentYear,"DD/MM/YYYY");
        creditcardMessage = "The expiration date on card should be a minimum 06/"+currentYear+" to pay through installments.";
      }
      else if(currentDateObj.isSameOrBefore(compareFromObj.dec) && currentDateObj.isSameOrAfter(compareFromObj.oct)){
        compareToObj = moment("01/06/"+(currentYear+1),"DD/MM/YYYY");
        creditcardMessage = "The expiration date on card should be a minimum 06/"+(currentYear+1)+" to pay through installments.";
      }
    }

    if(!expiryDateObj.isSameOrAfter(compareToObj)) {
      return false;
    }
    return true;
  }, creditcardMessageFn);
}

export default {
  name: 'init-jquery-validations',
  initialize
};