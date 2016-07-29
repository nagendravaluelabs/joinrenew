/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Helper.helper(function ([value]) {
  "use strict";
  var dateObj, date, month, year;
  dateObj = new Date(value);
  date = dateObj.getDate();
  date = (date < 10) ? "0"+date : date;
  month = (dateObj.getMonth()+1);
  month = (month < 10) ? "0"+month : month;
  year = dateObj.getFullYear();
  return month + "/" + date + "/" + year;
});