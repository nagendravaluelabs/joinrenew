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
      var primaryData, personalData, name, primaryAddress, userData, addressArr;
      userData = [];
      addressArr = [];
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
            if(!Ember.getWithDefault(personalData, "organization.isLinkedAccount", false) && !Ember.getWithDefault(personalData, "organizationInfo.isNewOrganization", false)) {
              if(typeof personalData.address.office !== "undefined") {
                primaryAddress[0]= personalData.address.office.line1;
                primaryAddress[1]= personalData.address.office.line2;
                
                if (personalData.address.office.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.address.office.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34" ){
                addressArr[addressArr.length] = personalData.address.office.city;
                addressArr[addressArr.length] = personalData.address.office.state.value;
                addressArr[addressArr.length] = personalData.address.office.country.value;
                } else {
                addressArr[addressArr.length] = personalData.address.office.city;
                addressArr[addressArr.length] = personalData.address.office.country.value;
                }  
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(", ");
                if(personalData.address.office.zip !== "") {
                  addressArr += " "+personalData.address.office.zip;
                }
                primaryAddress[2]= addressArr;
              }
            } else {
              if(Ember.getWithDefault(personalData, "organizationInfo.isNewOrganization", false)) {
                primaryAddress[0]= personalData.organizationInfo.addressLine1;
                primaryAddress[1]= personalData.organizationInfo.addressLine2;

                if (personalData.organizationInfo.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.organizationInfo.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34" ){
                  addressArr[addressArr.length] = personalData.organizationInfo.locality;
                  addressArr[addressArr.length] = personalData.organizationInfo.workState.value;
                  addressArr[addressArr.length] = personalData.organizationInfo.country.value;
                } else {
                  addressArr[addressArr.length] = personalData.organizationInfo.locality;
                  addressArr[addressArr.length] = personalData.organizationInfo.country.value;
                }
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(", ");
                if(personalData.organizationInfo.PostalCode !== "") {
                  addressArr += " "+personalData.organizationInfo.PostalCode;
                }
                primaryAddress[2]= addressArr;
              } else {
                var linkedAddress = Ember.getWithDefault(personalData, "organization.linkedAddress", "");
                
                primaryAddress[0]= linkedAddress.line1;
                primaryAddress[1]= linkedAddress.line2;
                
                if (linkedAddress.country.toUpperCase() === "UNITED STATES" || linkedAddress.country.toUpperCase() === "CANADA" ){
                addressArr[addressArr.length] = linkedAddress.city;
                addressArr[addressArr.length] = linkedAddress.state;
                } else {
                addressArr[addressArr.length] = linkedAddress.city;
                addressArr[addressArr.length] = linkedAddress.country;
                }
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(", ");
                if(linkedAddress.zip !== "") {
                  addressArr += " "+linkedAddress.zip;
                }
                primaryAddress[2]= addressArr;
              }
            }
          } else {
            if(typeof personalData.address.home !== "undefined") {
              primaryAddress[0]= personalData.address.home.line1;
              primaryAddress[1]= personalData.address.home.line2;
              if (personalData.address.home.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.address.home.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34"){
              addressArr[addressArr.length] = personalData.address.home.city;
              addressArr[addressArr.length] = personalData.address.home.state.value;
              addressArr[addressArr.length] = personalData.address.home.country.value;
            } else {
              addressArr[addressArr.length] = personalData.address.home.city;
              addressArr[addressArr.length] = personalData.address.home.country.value;
            }  
            addressArr = addressArr.filter(v=>v!=='');
            addressArr = addressArr.join(", ");
            if(personalData.address.home.zip !== "") {
              addressArr += " "+personalData.address.home.zip;
            }
            primaryAddress[2]= addressArr;
            }
          }
          
          userData[index] = {"title": "address", "value": primaryAddress, "class": "address"};
        }
        this.set("userData", userData);
      }
    },
    actions: {
        showPersonalInfo: function (mode) {
            'use strict';
            mode = (typeof mode !== undefined) ? mode : false;
            var value = this.get("editContactInfo");
            this.set("editContactInfo", !value);
            /*if(mode) {
                var localData = JSON.parse(localStorage.aiaUserInfo);
                this.set("primaryData.data", localData);
            }*/
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
