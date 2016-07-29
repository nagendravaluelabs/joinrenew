/*jslint white:true, devel:true, es6:true, this:true, browser:true */


import Ember from 'ember';
export default Ember.Controller.extend({
    editContactInfo: false,
    primaryData: Ember.inject.service('user-data'),
    userData: [],
    init: function () {
      "use strict";
      this.userDataFunc();
    },
    userDataObserver: function () {
      "use strict";
      this.userDataFunc();
    }.observes('primaryData.data'),
    userDataFunc: function () {
      "use strict";
      var primaryData, personalData, name, primaryAddress, userData;
      userData = [];
      primaryData = this.get("primaryData");
      if (primaryData.data !== "undefined" && primaryData.data !== "") {
        personalData = primaryData.data.personal;
        name = personalData.prefix + " " + personalData.firstname + " " + personalData.middlename + " " + personalData.lastname + " " + personalData.suffix;
        var index = userData.length;
        userData[index] = {};
        userData[index] = {"title": "", "value": name, "class": "full-name"};
        if (typeof personalData.phone !== "undefined") {
          if (typeof personalData.phone.home !== "undefined" && personalData.phone.home.value!=="") {
            index++;
            userData[index] = {};
            userData[index] = {"title": "Home phone", "value": personalData.phone.home.value, "class": "home-phone"};
            if (personalData.phone.primary === "home") {
              userData[index].isPrimary = true;
            }
          }
          if (typeof personalData.phone.mobile !=="undefined" && personalData.phone.mobile.value!=="") {
            index++;
            userData[index] = {};
            userData[index] = {"title": "Mobile phone", "value": personalData.phone.mobile.value, "class": "mobile-phone"};
            if (personalData.phone.primary === "mobile") {
              userData[index].isPrimary = true;
            }
          }
          if (typeof personalData.phone.directoffice !== "undefined" && personalData.phone.directoffice.value!=="") {
            index++;
            userData[index] = {};
            userData[index] = {"title": "Work phone", "value": personalData.phone.directoffice.value, "class": "work-phone"};
            if (personalData.phone.primary === "home") {
              userData[index].isPrimary = true;
            }
          }
        }
        
        if (typeof personalData.address !== "undefined") {
          index++;
          userData[index] = {};
          primaryAddress=[];
          if (personalData.address.primary === "home") {
            primaryAddress[0]= personalData.address.home.line1;
            primaryAddress[1]= personalData.address.home.line2;
            primaryAddress[2]= personalData.address.home.city + ", " + personalData.address.home.state.value + ", " + personalData.address.home.country.value + ", " + personalData.address.home.zip;
          } else {
            primaryAddress[0]= personalData.address.office.line1;
            primaryAddress[1]= personalData.address.office.line2;
            primaryAddress[2]= personalData.address.office.city + ", " + personalData.address.office.state.value + ", " + personalData.address.office.country.value + ", " + personalData.address.office.zip;
          }
          console.log(primaryAddress);
          userData[index] = {"title": "address", "value": primaryAddress, "class": "address"};
        }
        this.set("userData", userData);
      }
    },
    actions: {
        showPersonalInfo: function () {
            'use strict';
            var value = this.get("editContactInfo");
            this.set("editContactInfo", !value);
        }
    }
});
