/*jslint es6, this*/
import DS from 'ember-data';
import Ember from 'ember';
const {$} = Ember;

export default Ember.Controller.extend({
    editContactInfo: false,
    primaryData: Ember.inject.service('user-data'),
    userData: [],
    userDataObserver: function() {
      var primaryData, personalData, name, address, userData;
      userData = [];
      primaryData = this.get("primaryData");
      personalData = primaryData.data.personal;
      name = personalData.prefix + " " + personalData.firstname + " " + personalData.middlename + " " + personalData.lastname + " " + personalData.suffix;
      var index = userData.length;
      userData[index] = {};
      userData[index] = {"title": "", "value": name, "class": "full-name"};
      if(typeof personalData.phone != "undefined") {
        if(typeof personalData.phone.home != "undefined" && personalData.phone.home.value!="") {
          index++;
          userData[index] = {};
          userData[index] = {"title": "Home phone", "value": personalData.phone.home.value, "class": "home-phone"};
          if(personalData.phone.primary === "home") {
            userData[index].isPrimary = true;
          }
        }
        if(typeof personalData.phone.mobile !="undefined" && personalData.phone.mobile.value!="") {
          index++;
          userData[index] = {};
          userData[index] = {"title": "Mobile phone", "value": personalData.phone.mobile.value, "class": "mobile-phone"};
          if(personalData.phone.primary === "mobile") {
            userData[index].isPrimary = true;
          }
        }
        if(typeof personalData.phone.work != "undefined" && personalData.phone.work.value!="") {
          index++;
          userData[index] = {};
          userData[index] = {"title": "Work phone", "value": personalData.phone.work.value, "class": "work-phone"};
          if(personalData.phone.primary === "work") {
            userData[index].isPrimary = true;
          }
        }
      }
      
      if(typeof personalData.address != "undefined") {
        index++;
        userData[index] = {};
        if(personalData.address.primary == "home") {
          address += personalData.address.home.line1+"\n";
          address += personalData.address.home.line2+"\n";
          address += personalData.address.home.city + ", ";
          address += personalData.address.home.state.value + ", ";
          address += personalData.address.home.country.value + ", ";
          address += personalData.address.home.zip;
        } else {
          address += personalData.address.work.line1+"\n";
          address += personalData.address.work.line2+"\n";
          address += personalData.address.work.city + ", ";
          address += personalData.address.work.state.value + ", ";
          address += personalData.address.work.country.value + ", ";
          address += personalData.address.work.zip;
        }
        userData[index] = {"title": "address", "value": personalData.phone.work.value, "class": "address"};
      }
      this.set("userData", userData);
    }.observes('primaryData.data'),
    actions: {
        showPersonalInfo: function () {
            'use strict';
            var value = this.get("editContactInfo");
            this.set("editContactInfo", !value);
        }
    }
});
