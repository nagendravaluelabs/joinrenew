import Ember from 'ember';

export default Ember.Helper.helper(function([value]) {
  var dateObj, date, month, year;
  dateObj = new Date(value);
  date = dateObj.getDate();
  date = (date < 10) ? "0"+date : date;
  month = (dateObj.getMonth()+1);
  month = (month < 10) ? "0"+month : month;
  year = dateObj.getFullYear();
  return month + "/" + date + "/" + year;
});