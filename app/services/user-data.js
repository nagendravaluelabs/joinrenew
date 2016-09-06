/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import inject from 'ember-service/inject';
export default Ember.Service.extend({
  data: "",
  organization: {
    country: "bc4b70f8-280e-4bb0-b935-9f728c50e183",
    countryCode: "bc4b70f8-280e-4bb0-b935-9f728c50e183"
  },
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
    var self, generic, logoutState, noLogouts;
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
                    data.personal.address.primary = (data.personal.address.primary === "billing") ? "home" : data.personal.address.primary;
                    if(!Ember.getWithDefault(data,'personal.address.home', false)) {
                      data.personal.address.home = {};
                      data.personal.address.home.key = "";
                      data.personal.address.home.line1 = "";
                      data.personal.address.home.line2 = "";
                      data.personal.address.home.line3 = "";
                      data.personal.address.home.city = "";
                      data.personal.address.home.state = {
                        "key": "",
                        "value": ""
                      };
                      data.personal.address.home.country =  {
                        "key": "",
                        "value": ""
                      };
                      data.personal.address.home.zip = "";
                    }
                    
                    if(!Ember.getWithDefault(data,'personal.address.office', false)) {
                      data.personal.address.office = {};
                      data.personal.address.office.key = "";
                      data.personal.address.office.isExsist = false;
                      data.personal.address.office.line1 = "";
                      data.personal.address.office.line2 = "";
                      data.personal.address.office.line3 = "";
                      data.personal.address.office.city = "";
                      data.personal.address.office.state = {
                        "key": "",
                        "value": ""
                      };
                      data.personal.address.office.country =  {
                        "key": "",
                        "value": ""
                      };
                      data.personal.address.office.zip = "";
                    }else{
                      data.personal.address.office.isExsist = true;
                    }
                    data.personal.organizationInfo = {};
                    data.personal.organizationInfo.country = {};
                    data.personal.organizationInfo.country.key = "";
                    data.personal.organizationInfo.country.value= "";
                    data.personal.organizationInfo.workState = {};
                    data.personal.organizationInfo.workState.key = "";
                    data.personal.organizationInfo.workState.value= "";
                    data.paymentInfo = {};
                    data.paymentInfo.paymentType = "Debit/Credit Card";
                    data.paymentInfo.isArchiPAC = true;
                    self.set("data", data);
                    localStorage.aiaUserInfo = JSON.stringify(data);
                    self.get("auth").userNotifier();
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
              noLogouts = ["invalid-invoice", "invoice-unavailable"];
              logoutState = (noLogouts.indexOf(error) === -1) ? false : true;
              self.get('auth').logout(logoutState);
              self.get('janrain').doLogout(logoutState);
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
  getCardType: function(number) {
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null) {
      return "visa";
    }

    // Mastercard
    re = new RegExp("^5[1-5]");
    if (number.match(re) != null) {
      return "master";
    }

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null) {
      return "amex";
    }

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null) {
      return "discover";
    }
    return "none";
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
        LicensedToPractice,
        isArchiPAC,
        installmentsInfo,
        InstallmentProgram,
        DonationInfo,
        address_owner_key;
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
    installmentsInfo = {};
    DonationInfo = {};
    
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
    membershipInfo.LiabilityCode = Ember.getWithDefault(data,'membershipInfo.LiabilityCode', 0);
    
    /* Payment */
    paymentInfo.CardNumber = Ember.getWithDefault(data,'paymentInfo.CardNumber', "");
    paymentType = Ember.getWithDefault(data,'paymentInfo.paymentType', "");
    
    if(paymentType==="Electronic check") {
      paymentType = Ember.getWithDefault(genericData,'phonetypekeys.echeck', "");
    } else {
      paymentType = this.getCardType(paymentInfo.CardNumber);
      paymentType = Ember.getWithDefault(genericData,'paymenttypekeys.'+paymentType, "");
    }
    
    paymentInfo.ThirdPartyVendors = 0; // Need Clarification
    paymentInfo.PaymentTypeKey = paymentType;
    paymentInfo.NameOnCard = Ember.getWithDefault(data,'paymentInfo.NameOnCard', "");
    paymentInfo.ExpirationMonth = Ember.getWithDefault(data,'paymentInfo.ExpirationMonth', "");
    paymentInfo.ExpirationYear = Ember.getWithDefault(data,'paymentInfo.ExpirationYear', "");
    paymentInfo.SecurityCode = Ember.getWithDefault(data,'paymentInfo.SecurityCode', "");
    isArchiPAC = Ember.getWithDefault(data,'paymentInfo.isArchiPAC', false);
    isArchiPAC = (isArchiPAC) ? 1 : 0;
    paymentInfo.isArchiPAC = isArchiPAC;
    installmentsAgreement = Ember.getWithDefault(data,'paymentInfo.InstallmentAgreement', false);
    installmentsAgreement = (installmentsAgreement) ? 1 : 0;
    paymentAgreement = Ember.getWithDefault(data,'paymentInfo.TermsConditionsAgreement', false);
    paymentAgreement = (paymentAgreement) ? 1 : 0;
    //paymentInfo.InstallmentAgreement = installmentsAgreement;
    paymentInfo.TermsConditionsAgreement = paymentAgreement;
    
    /* Donation Information */
    if(isArchiPAC === 1) {
      DonationInfo.Donations = {};
      DonationInfo.Donations.Donation = {};
      DonationInfo.Donations.Donation.FundCode = "ArchiPac Contribution";
      DonationInfo.Donations.Donation.Amount = 25.00;
    }
    
    /* Installments */
    if(installmentsAgreement && Ember.getWithDefault(data,'paymentInfo.paymentType', "") === "EMI") {
      installmentsInfo.Installments = {};
      installmentsInfo.Installments.InstallmentAgreement = installmentsAgreement;
      installmentsInfo.Installments.NumberOfInstallments = Ember.getWithDefault(data,'paymentInfo.InstallmentCount', "");
      InstallmentProgram = Ember.get(genericData, "installmentkeys");
      
      InstallmentProgram = InstallmentProgram.filter(function(n){ 
        return parseInt(n.ins_max_installments) === installmentsInfo.Installments.NumberOfInstallments; 
      }); 
      
      InstallmentProgram = Ember.getWithDefault(InstallmentProgram,'0', {});
      
      installmentsInfo.Installments.InstallmentProgramKey = Ember.getWithDefault(InstallmentProgram,'ins_key', "");
      installmentsInfo.Installments.InstallmentAdministrativeFee = Ember.getWithDefault(InstallmentProgram,'ins_convenience_fee', "");
    }
    /* Membership Packages */
    membershipPackagesObj.MembershipPackages = {};
    membershipPackagesObj.MembershipPackages.MembershipPackage = [];
    Ember.$.each(data.invoice.dues, function(keyName, value){
      var memberKeyLength = membershipPackagesObj.MembershipPackages.MembershipPackage.length;
      membershipPackagesObj.MembershipPackages.MembershipPackage[memberKeyLength] = {
        "MembershipPackageKey": value.packagekey
      };
    });
    
    /* For Join Process */
    
    /*otherInfo.MagazineDeliveryType = 0;
    otherInfo.LocationType = "Home";
    otherInfo.LocationCountry = "UNITED STATES";
    otherInfo.LocationCity = "76244-6067";*/
    
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
        if(!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false)) {
          if(Ember.getWithDefault(data.personal.address, keyName, false) !== false) {
            addressObj = Ember.getWithDefault(data.personal.address, keyName, "");
            isPrimary = (data.personal.address.primary === keyName) ? 1 : 0;
            addressKey = addressObj.key;
          } else {
            isPrimary = 0;
            addressKey = "";
          }
          address_owner_key = Ember.getWithDefault(data.personal, "address.office.address_owner_key", "");
          if(address_owner_key !== "" && address_owner_key !== membershipInfo.IndividualKey) {
            addressInfo.Addresses.Address[addressLength] = {};
            if(!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false)) {
              addressInfo.Addresses.Address[addressLength].CompanyKey = data.personal.organization.key;
            }
            addressInfo.Addresses.Address[addressLength].TypeKey = Ember.getWithDefault(genericData.addresstypekeys, keyName, "");
            addressInfo.Addresses.Address[addressLength].IsPrimary = isPrimary;
            addressInfo.Addresses.Address[addressLength].Key = addressKey;
          }
        }
      }
    });
    if(address_owner_key !== "" && address_owner_key !== membershipInfo.IndividualKey) {
      organizationInfo.RelatedOrganizations = {};
      if(!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false)) {
        organizationInfo.RelatedOrganizations.RelatedOrganization = {
          "Key" : data.personal.organization.key
        };
      } else {
        organizationInfo.RelatedOrganizations.RelatedOrganization = {
          "Name": Ember.getWithDefault(data.personal, "organizationInfo.Name", ""),
          "Type": Ember.getWithDefault(data.personal, "organizationInfo.companyType", ""),
          "Website": Ember.getWithDefault(data.personal, "organizationInfo.Website", ""),
          "OrganizationAddress": {
            "TypeKey": Ember.getWithDefault(genericData.addresstypekeys, "office", ""),
            "Country": Ember.getWithDefault(data.personal, "organizationInfo.country.value", ""),
            "Line1": Ember.getWithDefault(data.personal, "organizationInfo.addressLine1", ""),
            "Line2": Ember.getWithDefault(data.personal, "organizationInfo.addressLine2", ""),
            "City": Ember.getWithDefault(data.personal, "organizationInfo.locality", ""),
            "State": Ember.getWithDefault(data.personal, "organizationInfo.workState.value", ""),
            "PostalCode": Ember.getWithDefault(data.personal, "organizationInfo.PostalCode", ""),
            "IsPrimary": (data.personal.address.primary === "office") ? 1 : 0
          },
          "OrganizationPhone": {
            "IsPrimary": (data.personal.phone.primary === "cell") ? 1 : 0,
            "TypeKey": Ember.getWithDefault(genericData.phonetypekeys, "cell", ""),
            "Number": Ember.getWithDefault(data.personal, "organizationInfo.orgPhone", "")
          }
        };
      }
    }
    membershipInfo = Object.assign(membershipInfo, membershipPackagesObj, paymentInfo, DonationInfo, installmentsInfo, otherInfo, personalInfo, phonesInfo, addressInfo, organizationInfo);
    
    mappedJSON.input.membership = membershipInfo;
    
    return mappedJSON;
  },
  saveRenewInfoToNF: function(data) {
    var saveRequestData, saveRequestParams;
    saveRequestData = {};
    saveRequestParams = data;
    saveRequestParams = JSON.stringify( saveRequestParams );
    saveRequestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: saveRequestParams
    };
    Ember.$('.ajax-spinner').show();
    return fetch(`${ENV.AIA_SAVE_URL}`, saveRequestData).then(response => {
      if(response.status === 200) {
        return response.json();        
      } else {
        return {};
      }
    }).then((json) => {
      Ember.$('.ajax-spinner').hide();
      return json;
    });
  },
  updateChosen: function(){
    setTimeout(function(){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});
