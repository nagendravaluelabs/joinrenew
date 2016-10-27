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
        name = personalData.prefix + " " + personalData.firstname + " " + personalData.middle + " " + personalData.lastname + " " + personalData.suffix;
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
                primaryAddress[0]= personalData.organization.name;
                primaryAddress[1]= personalData.address.office.line1;
                primaryAddress[2]= personalData.address.office.line2;
                primaryAddress[3]= personalData.address.office.line3;                
                if (personalData.address.office.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.address.office.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34" ){
                  if(personalData.address.office.city) {
                    var cityValue = personalData.address.office.city;
                    if(personalData.address.office.state && personalData.address.office.state.value) {
                      cityValue = cityValue+",";
                    }
                    addressArr[addressArr.length] = cityValue;
                  }
                  addressArr[addressArr.length] = personalData.address.office.state.value;
                  addressArr[addressArr.length] = personalData.address.office.zip;
                } else {
                addressArr[addressArr.length] = personalData.address.office.city;
                addressArr[addressArr.length] = personalData.address.office.zip;
                }  
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(" ");
                primaryAddress[4]= addressArr;
                primaryAddress[5]= personalData.address.office.country.value;
              }
            } else {
              if(Ember.getWithDefault(personalData, "organizationInfo.isNewOrganization", false)) {
                primaryAddress[0]= personalData.organizationInfo.Name;
                primaryAddress[1]= personalData.organizationInfo.addressLine1;
                primaryAddress[2]= personalData.organizationInfo.addressLine2;

                if (personalData.organizationInfo.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.organizationInfo.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34" ){
                  if(Ember.getWithDefault(personalData, "organizationInfo.locality", false)) {
                    addressArr[addressArr.length] = personalData.organizationInfo.locality+",";
                  }
                  addressArr[addressArr.length] = personalData.organizationInfo.workState.value;
                  addressArr[addressArr.length] = personalData.organizationInfo.PostalCode;
                } else {
                  if(Ember.getWithDefault(personalData, "organizationInfo.locality", false)) {
                    addressArr[addressArr.length] = personalData.organizationInfo.locality;
                  }
                  addressArr[addressArr.length] = personalData.organizationInfo.PostalCode;
                }
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(" ");
                primaryAddress[3]= addressArr;
                primaryAddress[4]= personalData.organizationInfo.country.value;
              } else {
                var linkedAddress, lACountry;
                linkedAddress = Ember.getWithDefault(personalData, "organization.linkedAddress", "");
                primaryAddress[0]= Ember.getWithDefault(linkedAddress, "name", "");
                primaryAddress[1]= Ember.getWithDefault(linkedAddress, "line1", "");
                primaryAddress[2]= Ember.getWithDefault(linkedAddress, "line2", "");
                lACountry = Ember.getWithDefault(linkedAddress, "country", "");
                if (lACountry.toUpperCase() === "UNITED STATES" || lACountry.toUpperCase() === "CANADA" ){
                  if(Ember.getWithDefault(linkedAddress, "city", false)) {
                    var linkedCity = Ember.getWithDefault(linkedAddress, "city", "");
                    if(Ember.getWithDefault(linkedAddress, "state", false)) {
                      linkedCity = linkedCity+",";
                    }
                    addressArr[addressArr.length] = linkedCity;
                  }
                  addressArr[addressArr.length] = Ember.getWithDefault(linkedAddress, "state", "");
                  addressArr[addressArr.length] = Ember.getWithDefault(linkedAddress, "zip", "");
                } else {
                  addressArr[addressArr.length] = Ember.getWithDefault(linkedAddress, "city", "");
                  addressArr[addressArr.length] = Ember.getWithDefault(linkedAddress, "zip", "");
                }
                addressArr = addressArr.filter(v=>v!=='');
                addressArr = addressArr.join(" ");
                primaryAddress[3]= addressArr;
                primaryAddress[4]= lACountry;
              }
            }
          } else {
            if(typeof personalData.address.home !== "undefined") {
              primaryAddress[0]= personalData.address.home.line1;
              primaryAddress[1]= personalData.address.home.line2;
              if (personalData.address.home.country.key.toUpperCase() === "BC4B70F8-280E-4BB0-B935-9F728C50E183" || personalData.address.home.country.key.toUpperCase() === "BE685760-5492-4BA3-B105-868E2010FA34") {
                if(Ember.getWithDefault(personalData, "address.home.city", false)) {
                  addressArr[addressArr.length] = personalData.address.home.city+",";
                }
                addressArr[addressArr.length] = personalData.address.home.state.value;
                addressArr[addressArr.length] = personalData.address.home.zip;
              } else {
                addressArr[addressArr.length] = personalData.address.home.city;
                addressArr[addressArr.length] = personalData.address.home.zip;
              }  
              addressArr = addressArr.filter(v=>v!=='');
              addressArr = addressArr.join(" ");
              primaryAddress[2]= addressArr;
              primaryAddress[3] = personalData.address.home.country.value;
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
