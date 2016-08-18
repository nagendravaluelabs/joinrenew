/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import inject from 'ember-service/inject';
export default Ember.Service.extend({
  data: "",
  auth: inject(),
  janrain: inject(),
  genericData: inject(),
  userKey: "",
  init: function() {
    var self= this;
    self._super(...arguments);
  },
  updateUserData: function() {
    var userKey;
    userKey = this.get("userKey");
    this.setUserData(userKey);
  }.observes("genericData.generic"),
  setUserData: function(userkey) {
    var self, generic;
    generic = this.get("genericData").generic;
    self= this;
    if(userkey !== null && userkey !== "") {
      if(generic !== "undefined" && generic !== "") {
        if(localStorage.aiaUserInfo !== undefined) {
          self.set("data", JSON.parse(localStorage.aiaUserInfo));
        } else {
          Ember.$.getJSON(`${ENV.AIA_DRUPAL_URL}?datatype=user&key=${userkey}`).then(function(data){
            var error = false;
            if(typeof data !== undefined) {
              if(typeof data.errormessage === "undefined") {
                if(typeof data.invoice !== "undefined") {
                  if(typeof data.invoice.proforma !== "undefined" && parseInt(data.invoice.proforma) === 1) {
                    data.userKey = userkey;
                    data.membershipInfo = {};
                    data.membershipInfo.persons = {};
                    data.membershipInfo.amount = {};
                    
                    if(!Ember.getWithDefault(data,'personal.phone.directoffice', false)) {
                      data.personal.phone.directoffice = {};
                      data.personal.phone.directoffice.country = "";
                      data.personal.phone.directoffice.key = "";
                      data.personal.phone.directoffice.value = "";
                    }
                    
                    if(!Ember.getWithDefault(data,'personal.phone.home', false)) {
                      data.personal.phone.home = {};
                      data.personal.phone.home.country = "";
                      data.personal.phone.home.key = "";
                      data.personal.phone.home.value = "";
                    }
                    
                    if(!Ember.getWithDefault(data,'personal.phone.cell', false)) {
                      data.personal.phone.cell = {};
                      data.personal.phone.cell.country = "";
                      data.personal.phone.cell.key = "";
                      data.personal.phone.cell.value = "";
                    }
                    
                    if(!Ember.getWithDefault(data,'personal.address.home', false)) {
                      data.personal.address.home = {};
                    }
                    
                    if(!Ember.getWithDefault(data,'personal.address.office', false)) {
                      data.personal.address.office = {};
                    }
                    
                    data.paymentInfo = {};
                    data.paymentInfo.paymentType = "Debit/Credit Card";
                    self.set("data", data);
                    localStorage.aiaUserInfo = JSON.stringify(data);
                  } else {
                    error = "invalid-invoice";
                  }
                } else {
                  error = "invalid-invoice";
                }
              } else {
                error = "invoice-unavailable";
              }
            } else {
              error = "invoice-unavailable";
            }
            if(error) {
              self.get('auth').set("authState", error);
              self.get('auth').logout();
              self.get('janrain').doLogout();
            }
          },function(){
            self.get('auth').set("authState", "invoice-unavailable");
            self.get('auth').logout();
            self.get('janrain').doLogout();
          });
        }
      } else {
        self.set("userKey", userkey);
      }
    } else {
      self.set("data", "");
    }    
  },
  saveUserData: function (data) {
      this.set("data", "");
      this.set("data", data);
      localStorage.aiaUserInfo = JSON.stringify(data);
  },
  reMapJSON: function(data) {
    var mappedJSON, 
        genericData, 
        membershipInfo, 
        membershipPackagesObj, 
        personalInfo, 
        phonesInfo, 
        addressInfo, 
        paymentInfo, 
        duesInfo, 
        otherInfo, 
        captureProfileData, 
        organizationInfo,
        paymentType,
        installmentsAgreement,
        paymentAgreement,
        LicensedToPractice;
    captureProfileData = JSON.parse(localStorage.janrainCaptureProfileData);
    genericData = this.get("genericData").generic;
    mappedJSON = {};
    mappedJSON.action = "completeRenewTransaction";
    mappedJSON.input = {};
    mappedJSON.input.membership = {};
    membershipInfo = {};
    membershipPackagesObj = {};
    phonesInfo = {};
    addressInfo = {};
    paymentInfo = {};
    duesInfo = {};
    otherInfo = {};
    personalInfo = {};
    organizationInfo= {};
    
    /* Renew Details */
    membershipInfo.IsRenew = 1;
    membershipInfo.IndividualKey = Ember.getWithDefault(data,'userKey', "");
    membershipInfo.InvoiceKey = Ember.getWithDefault(data,'invoice.invoiceKey', "");
    
    /* SupplementalDues */
    
    membershipInfo.SupplementalDuesID = Ember.getWithDefault(data,'membershipInfo.SupplementalDuesID', ""); // Member ID
    membershipInfo.SupplementalDuesName = Ember.getWithDefault(data,'membershipInfo.SupplementalDuesName', ""); // Member Name
    membershipInfo.TotalEmployeesKey = ""; // Empty
    membershipInfo.NonAIAMembers = Ember.getWithDefault(data,'membershipInfo.persons.nonmember_totals', 0);
    membershipInfo.AIAMembers = Ember.getWithDefault(data,'membershipInfo.persons.member_totals', 0);
    membershipInfo.TechnicalStaff = Ember.getWithDefault(data,'membershipInfo.persons.technical_totals', 0);
    membershipInfo.OtherStaff = Ember.getWithDefault(data,'membershipInfo.persons.other_totals', 0);
    membershipInfo.Associates = Ember.getWithDefault(data,'membershipInfo.persons.associate_totals', 0);
    LicensedToPractice = Ember.getWithDefault(data,'membershipInfo.LicensedToPractice', false);
    LicensedToPractice = (LicensedToPractice) ? 1 : 0;
    membershipInfo.LicensedToPractice = LicensedToPractice;
    membershipInfo.LiabilityCode = Ember.getWithDefault(data,'membershipInfo.LiabilityCode', "");
    
    /* Payment */
    paymentType = Ember.getWithDefault(data,'paymentInfo.paymentType', "");
    paymentType = (paymentType === "Debit/Credit Card" || paymentType=== "EMI") ? "credit" : "echeck";
    paymentInfo.ThirdPartyVendors = 0;
    paymentInfo.PaymentTypeKey = paymentType;
    paymentInfo.NameOnCard = Ember.getWithDefault(data,'paymentInfo.NameOnCard', "");
    paymentInfo.CardNumber = Ember.getWithDefault(data,'paymentInfo.CardNumber', "");
    paymentInfo.ExpirationMonth = Ember.getWithDefault(data,'paymentInfo.ExpirationMonth', "");
    paymentInfo.ExpirationYear = Ember.getWithDefault(data,'paymentInfo.ExpirationYear', "");
    paymentInfo.SecurityCode = Ember.getWithDefault(data,'paymentInfo.SecurityCode', "");
    
    installmentsAgreement = Ember.getWithDefault(data,'paymentInfo.InstallmentAgreement', false);
    installmentsAgreement = (installmentsAgreement) ? 1 : 0;
    paymentAgreement = Ember.getWithDefault(data,'paymentInfo.TermsConditionsAgreement', false);
    paymentAgreement = (paymentAgreement) ? 1 : 0;
    paymentInfo.InstallmentAgreement = installmentsAgreement;
    paymentInfo.TermsConditionsAgreement = paymentAgreement;
    
    /* Membership Packages */
    membershipPackagesObj.MembershipPackages = {};
    membershipPackagesObj.MembershipPackages.MembershipPackage = [];
    Ember.$.each(data.invoice.dues, function(keyName, value){
      var memberKeyLength = membershipPackagesObj.MembershipPackages.MembershipPackage.length;
      membershipPackagesObj.MembershipPackages.MembershipPackage[memberKeyLength] = {
        "MembershipPackageKey": value.packagekey
      };
    });
    /*membershipPackagesObj.MembershipPackages.MembershipPackage[membershipPackagesObj.MembershipPackages.MembershipPackage.length] = {
      "MembershipPackageKey": "61c9ce33-8244-4bd1-b505-7f5e5486cd78"
    };
    membershipPackagesObj.MembershipPackages.MembershipPackage[membershipPackagesObj.MembershipPackages.MembershipPackage.length] = {
      "MembershipPackageKey": "7d320168-0f13-449a-ba6c-7918bb39b847"
    };
    membershipPackagesObj.MembershipPackages.MembershipPackage[membershipPackagesObj.MembershipPackages.MembershipPackage.length] = {
      "MembershipPackageKey": "c57dcc7f-e5ba-4ba3-a4da-88b4d0abd81e"
    };*/
    
    /* For Join Process */
    otherInfo.MagazineDeliveryType = 0;
    otherInfo.LocationType = "Home";
    otherInfo.LocationCountry = "UNITED STATES";
    otherInfo.LocationCity = "76244-6067";
    
    /* Personal Information */
    personalInfo.Prefix = Ember.getWithDefault(data,'personal.prefix', "");
    personalInfo.FirstName = Ember.getWithDefault(data,'personal.firstname', "");
    personalInfo.MiddleInitial = Ember.getWithDefault(data,'personal.middlename', "");
    personalInfo.LastName = Ember.getWithDefault(data,'personal.lastname', "");
    personalInfo.Suffix = Ember.getWithDefault(data,'personal.suffix', "");
    personalInfo.Email = captureProfileData.email;
    
    /* Users Phone */
    
    phonesInfo.Phones = {};
    phonesInfo.Phones.PhoneNumber = [];
    
    Ember.$.each(genericData.phonetypekeys, function(keyName, value){
      var phoneLength,
          isPrimary,
          phoneKey,
          number,
          countryKey,
          phoneObj;
      value = value;
      phoneLength = phonesInfo.Phones.PhoneNumber.length;
      if(Ember.getWithDefault(data.personal.phone, keyName, false) !== false) {
        phoneObj = Ember.getWithDefault(data.personal.phone, keyName, "");
        isPrimary = (data.personal.phone.primary === keyName) ? 1 : 0;
        phoneKey = phoneObj.key;
        number = phoneObj.value;
        countryKey = phoneObj.country;
        
      } else {
        isPrimary = 0;
        phoneKey = "";
        number = "";
        countryKey = "";
      }
      phonesInfo.Phones.PhoneNumber[phoneLength] = {};
      phonesInfo.Phones.PhoneNumber[phoneLength].IsPrimary = isPrimary;
      phonesInfo.Phones.PhoneNumber[phoneLength].Key = phoneKey;
      phonesInfo.Phones.PhoneNumber[phoneLength].TypeKey = Ember.getWithDefault(genericData.phonetypekeys, keyName, "");
      phonesInfo.Phones.PhoneNumber[phoneLength].Number = number;
      phonesInfo.Phones.PhoneNumber[phoneLength].CountryKey = countryKey;
    });
    
    addressInfo.Addresses = {};
    addressInfo.Addresses.Address = [];
    
    Ember.$.each(genericData.addresstypekeys, function(keyName, value){
      var addressLength,
          isPrimary,
          addressKey,
          countryName,
          stateName,
          addressObj,
          Line1Val,
          Line2Val,
          Line3Val,
          CityName,
          PostalCodeName;
      value=value;
      addressLength = addressInfo.Addresses.Address.length;
      if(keyName === "home") {
        if(Ember.getWithDefault(data.personal.address, keyName, false) !== false) {
          addressObj = Ember.getWithDefault(data.personal.address, keyName, "");
          isPrimary = (data.personal.address.primary === keyName) ? 1 : 0;
          addressKey = addressObj.key;
          countryName = addressObj.country.value;
          stateName = addressObj.state.value;
          Line1Val = addressObj.line1;
          Line2Val = addressObj.line2;
          Line3Val = addressObj.line3;
          CityName = addressObj.city;
          PostalCodeName = addressObj.zip;
        } else {
          isPrimary = 0;
          addressKey = "";
          countryName = "";
          stateName = "";
          Line1Val = "";
          Line2Val = "";
          Line3Val = "";
          CityName = "";
          PostalCodeName = "";
        }
        addressInfo.Addresses.Address[addressLength] = {};
        addressInfo.Addresses.Address[addressLength].IsPrimary = isPrimary;
        addressInfo.Addresses.Address[addressLength].Key = addressKey;
        addressInfo.Addresses.Address[addressLength].TypeKey = Ember.getWithDefault(genericData.addresstypekeys, keyName, "");
        addressInfo.Addresses.Address[addressLength].Country = countryName;
        
        addressInfo.Addresses.Address[addressLength].State = stateName;
        addressInfo.Addresses.Address[addressLength].Line1 = Line1Val;
        addressInfo.Addresses.Address[addressLength].Line2 = Line2Val;
        addressInfo.Addresses.Address[addressLength].Line3 = Line3Val;
        addressInfo.Addresses.Address[addressLength].City = CityName;
        addressInfo.Addresses.Address[addressLength].PostalCode = PostalCodeName;
      } else if(keyName === "office") {
        if(Ember.getWithDefault(data.personal.address, keyName, false) !== false) {
          addressObj = Ember.getWithDefault(data.personal.address, keyName, "");
          isPrimary = (data.personal.address.primary === keyName) ? 1 : 0;
          addressKey = addressObj.key;
        } else {
          isPrimary = 0;
          addressKey = "";
        }
        addressInfo.Addresses.Address[addressLength] = {};
        addressInfo.Addresses.Address[addressLength].CompanyKey = "";
        addressInfo.Addresses.Address[addressLength].Type = "office";
        addressInfo.Addresses.Address[addressLength].IsPrimary = isPrimary;
        addressInfo.Addresses.Address[addressLength].Key = addressKey;
      }
    });
    
    organizationInfo.RelatedOrganizations = {};
    organizationInfo.RelatedOrganizations.RelatedOrganization = {
      "Key" : data.personal.organization.key
    };
    
    membershipInfo = Object.assign(membershipInfo, membershipPackagesObj, paymentInfo, otherInfo, personalInfo, phonesInfo, addressInfo, organizationInfo);
    
    mappedJSON.input.membership = membershipInfo;
    
    return mappedJSON;
  },
  saveRenewInfoToNF: function(data) {
    var saveRequestData, saveRequestParams;
    saveRequestData = {};
    saveRequestParams = data;
    //saveRequestParams = $.param( saveRequestParams );
    /*saveRequestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: saveRequestParams,
      mode: 'no-cors'
    };*/
    Ember.$.ajax(`${ENV.AIA_SAVE_URL}`, {
        "type": 'POST', // HTTP method
        "dataType": 'JSON', // type of data expected from the API response
        "data": saveRequestParams, // End data payload
        "success": function (data) {
          console.log(data);
        },
        "error": function (jqXHR) {
            window.console.log(jqXHR);
        }
    });

  },
  updateChosen: function(){
    setTimeout(function(){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});
