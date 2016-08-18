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
            index += 1;
            userData[index] = {};
            userData[index] = {"title": "Home phone", "value": personalData.phone.home.value, "class": "home-phone"};
            if (personalData.phone.primary === "home") {
              userData[index].isPrimary = true;
            }
          }
          if ((typeof personalData.phone.cell !=="undefined" && personalData.phone.cell.value!=="") || (typeof personalData.phone.mobile !=="undefined" && personalData.phone.mobile.value!=="")) {
            index += 1;
            userData[index] = {};
             var PhoneValues = (personalData.phone.primary === "mobile") ? personalData.phone.mobile.value : personalData.phone.cell.value;
                 userData[index] = {"title": "Mobile phone", "value": PhoneValues, "class": "mobile-phone"};
                if(personalData.phone.primary === "mobile" ||personalData.phone.primary==="cell"){
                userData[index].isPrimary = true;
                }
          }
          if (typeof personalData.phone.directoffice !== "undefined" && personalData.phone.directoffice.value!=="") {
            index += 1;
            userData[index] = {};
            userData[index] = {"title": "Work phone", "value": personalData.phone.directoffice.value, "class": "work-phone"};
            if (personalData.phone.primary === "work" || personalData.phone.primary === "directoffice" ) {
              userData[index].isPrimary = true;
            }
          }
        }
        
        if (typeof personalData.address !== "undefined") {
          index += 1;
          userData[index] = {};
          primaryAddress=[];
          if (personalData.address.primary === "office") {
            if(typeof personalData.address.office !== "undefined") {
              primaryAddress[0]= personalData.address.office.line1;
              primaryAddress[1]= personalData.address.office.line2;
              primaryAddress[2]= personalData.address.office.city + ", " + personalData.address.office.state.value + ", " + personalData.address.office.country.value + ", " + personalData.address.office.zip;
            }
          } else {
            if(typeof personalData.address.home !== "undefined") {
              primaryAddress[0]= personalData.address.home.line1;
              primaryAddress[1]= personalData.address.home.line2;
              primaryAddress[2]= personalData.address.home.city + ", " + personalData.address.home.state.value + ", " + personalData.address.home.country.value + ", " + personalData.address.home.zip;
            }
          }
          
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
        },
        
        savePersonalInfo: function (data, isRedirect) {
            isRedirect = (isRedirect === undefined) ? false : isRedirect;
            this.get("primaryData").saveUserData(data);
            if(isRedirect) {
              this.transitionToRoute('membership-dues');              
            }
        }
    }
});
