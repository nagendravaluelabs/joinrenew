/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global $*/
import Ember from 'ember';
import ENV from '../config/environment';
import fetch from 'ember-network/fetch';
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
                    data.personal.middle = data.personal.middlename;
                    if(!Ember.getWithDefault(data,'personal.phone', false)) {
                      data.personal.phone = {};
                    }
                    if(!Ember.getWithDefault(data,'personal.address', false)) {
                      data.personal.address = {};
                      data.personal.address.primary = "home";
                    }
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
                    data.personal.primaryAddress = data.personal.address.primary;
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
                    if(!Ember.getWithDefault(data,'personal.organization', false)) {
                      data.personal.organization = {};
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
                    data.paymentInfo.eCheckMode = "C";
                    data.paymentInfo.isArchiPAC = true;
                    self.set("data", data);
                    localStorage.aiaUserInfo = JSON.stringify(data);
                    localStorage.aiaUserInfoVerify = JSON.stringify(data);
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
      return "mastercard";
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
        paymentMode,
        installmentsAgreement,
        paymentAgreement,
        LicensedToPractice,
        isArchiPAC,
        installmentsInfo,
        InstallmentProgram,
        DonationInfo,
        address_owner_key,
        chaptersInfo,
        userInitialData;
    captureProfileData = JSON.parse(localStorage.janrainCaptureProfileData);
    userInitialData = JSON.parse(localStorage.aiaUserInfoVerify);
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
    membershipInfo.NonAIAMembers = (membershipInfo.NonAIAMembers) ? membershipInfo.NonAIAMembers : 0;
    membershipInfo.AIAMembers = Ember.getWithDefault(data,'membershipInfo.persons.member_totals', 0);
    membershipInfo.AIAMembers = (membershipInfo.AIAMembers) ? membershipInfo.AIAMembers : 0;
    membershipInfo.TechnicalStaff = Ember.getWithDefault(data,'membershipInfo.persons.technical_totals', 0);
    membershipInfo.TechnicalStaff = (membershipInfo.TechnicalStaff) ? membershipInfo.TechnicalStaff : 0;
    membershipInfo.OtherStaff = Ember.getWithDefault(data,'membershipInfo.persons.other_totals', 0);
    membershipInfo.OtherStaff = (membershipInfo.OtherStaff) ? membershipInfo.OtherStaff : 0;
    membershipInfo.Associates = Ember.getWithDefault(data,'membershipInfo.persons.associate_totals', 0);
    membershipInfo.Associates = (membershipInfo.Associates) ? membershipInfo.Associates : 0;
    LicensedToPractice = Ember.getWithDefault(data,'membershipInfo.LicensedToPractice', false);
    LicensedToPractice = (LicensedToPractice) ? 1 : 0;
    membershipInfo.LicensedToPractice = LicensedToPractice;
    membershipInfo.LiabilityCode = Ember.getWithDefault(data,'membershipInfo.LiabilityCode', 0);
    
    /* Chapter Dues */
    chaptersInfo = Ember.getWithDefault(data,'invoice.supplementaldues', false);
    if(chaptersInfo) {
      duesInfo.Dues = {};
      duesInfo.Dues.Due = [];
      Ember.$.each(chaptersInfo, function(keyName, value){
        var chapterDetails, chapterLength, sumOfDues, maxDueAmount;
        sumOfDues = parseFloat(value.member)*parseFloat(membershipInfo.AIAMembers);
        sumOfDues += parseFloat(value.nonmember)*parseFloat(membershipInfo.NonAIAMembers);
        sumOfDues += parseFloat(value.technical)*parseFloat(membershipInfo.TechnicalStaff);
        sumOfDues += parseFloat(value.associate)*parseFloat(membershipInfo.Associates);
        sumOfDues += parseFloat(value.other)*parseFloat(membershipInfo.OtherStaff);
        chapterLength = duesInfo.Dues.Due.length;
        if(sumOfDues > 0) {
          if(keyName === "state") {
            maxDueAmount = Ember.getWithDefault(data, "invoice.supplementaldues."+keyName+".max", 0);
            sumOfDues = (maxDueAmount > 0 && sumOfDues > maxDueAmount) ? maxDueAmount : sumOfDues;
          }
          chapterDetails = {};
          chapterDetails.ChapterKey = Ember.getWithDefault(data, "chapter."+keyName+".chapterkey", 0);
          chapterDetails.TotalDueAmount = parseFloat(sumOfDues).toFixed(2);
          duesInfo.Dues.Due[chapterLength] = chapterDetails;
        }
      });
    
      if(duesInfo.Dues.Due.length === 0) {
        duesInfo = {};
      }
    }
    
    /* Payment */
    paymentInfo.CardNumber = Ember.getWithDefault(data,'paymentInfo.CardNumber', "");
    paymentMode = Ember.getWithDefault(data,'paymentInfo.paymentType', "");
    paymentType = paymentMode;
    if(paymentMode==="Electronic check") {
      paymentType = Ember.getWithDefault(genericData,'paymenttypekeys.electronic_check', "");
    } else {
      paymentType = this.getCardType(paymentInfo.CardNumber);
      paymentType = Ember.getWithDefault(genericData,'paymenttypekeys.'+paymentType, "");
    }
    
    paymentInfo.ThirdPartyVendors = 0; // Need Clarification
    paymentInfo.PaymentTypeKey = paymentType;
    if(paymentMode === "Electronic check") {
      paymentInfo.AccountNumber = Ember.getWithDefault(data,'paymentInfo.AccountNumber', "");
      paymentInfo.NameOnAccount = Ember.getWithDefault(data,'paymentInfo.AccountName', "");
      paymentInfo.AccountType = Ember.getWithDefault(data,'paymentInfo.eCheckMode', "");
      paymentInfo.RoutingNumber = Ember.getWithDefault(data,'paymentInfo.RoutingNumber', "");
    } else {
      paymentInfo.NameOnCard = Ember.getWithDefault(data,'paymentInfo.NameOnCard', "");
      paymentInfo.ExpirationMonth = Ember.getWithDefault(data,'paymentInfo.ExpirationMonth', "");
      paymentInfo.ExpirationYear = Ember.getWithDefault(data,'paymentInfo.ExpirationYear', "");
      paymentInfo.SecurityCode = Ember.getWithDefault(data,'paymentInfo.SecurityCode', "");
    }
    isArchiPAC = Ember.getWithDefault(data,'paymentInfo.isArchiPAC', false);
    isArchiPAC = (isArchiPAC) ? 1 : 0;
    installmentsAgreement = Ember.getWithDefault(data,'paymentInfo.InstallmentAgreement', false);
    installmentsAgreement = (installmentsAgreement) ? 1 : 0;
    paymentAgreement = Ember.getWithDefault(data,'paymentInfo.TermsConditionsAgreement', false);
    paymentAgreement = (paymentAgreement) ? 1 : 0;
    //paymentInfo.InstallmentAgreement = installmentsAgreement;
    paymentInfo.TermsConditionsAgreement = paymentAgreement;
    
    /* Donation Information */
    if(paymentMode !== "Electronic check" && isArchiPAC === 1) {
      paymentInfo.isArchiPAC = isArchiPAC;
      DonationInfo.Donations = {};
      DonationInfo.Donations.Donation = {};
      DonationInfo.Donations.Donation.FundCode = "ArchiPac Contribution";
      DonationInfo.Donations.Donation.Amount = parseFloat(25.00).toFixed(2);
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
      installmentsInfo.Installments.InstallmentAdministrativeFees = parseFloat(Ember.getWithDefault(InstallmentProgram,'ins_convenience_fee', "")).toFixed(2);
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
    personalInfo.MiddleInitial = Ember.getWithDefault(data,'personal.middle', "");
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
          phoneObj,
          deleteVal,
          defaultPhoneObj;
      value = value;
      phoneLength = phonesInfo.Phones.PhoneNumber.length;
      if(Ember.getWithDefault(data.personal.phone, keyName, false) !== false) {
        phoneObj = Ember.getWithDefault(data.personal.phone, keyName, "");
        defaultPhoneObj = Ember.getWithDefault(userInitialData.personal.phone, keyName, "");
        isPrimary = (data.personal.phone.primary === keyName) ? 1 : 0;
        phoneKey = phoneObj.key;
        number = phoneObj.value;
        countryKey = phoneObj.country;
        deleteVal = 0;
        if((defaultPhoneObj.value !== "" && phoneObj.value === "") || (defaultPhoneObj.country !== "" && phoneObj.country === "")){
          number = defaultPhoneObj.value;
          countryKey = defaultPhoneObj.country;
          deleteVal = 1;
        }
      } else {
        isPrimary = 0;
        phoneKey = "";
        number = "";
        countryKey = "";
        deleteVal = 0;
      }
      phonesInfo.Phones.PhoneNumber[phoneLength] = {};
      phonesInfo.Phones.PhoneNumber[phoneLength].IsPrimary = isPrimary;
      phonesInfo.Phones.PhoneNumber[phoneLength].Key = phoneKey;
      phonesInfo.Phones.PhoneNumber[phoneLength].TypeKey = Ember.getWithDefault(genericData.phonetypekeys, keyName, "");
      phonesInfo.Phones.PhoneNumber[phoneLength].Number = number;
      phonesInfo.Phones.PhoneNumber[phoneLength].CountryKey = countryKey;
      phonesInfo.Phones.PhoneNumber[phoneLength].Delete = deleteVal;
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
          PostalCodeName,
          defaultAddressObj;
      value=value;
      addressLength = addressInfo.Addresses.Address.length;
      if(keyName === "home") {
        if(Ember.getWithDefault(data.personal.address, keyName, false) !== false) {
          addressObj = Ember.getWithDefault(data.personal.address, keyName, "");
          defaultAddressObj = Ember.getWithDefault(userInitialData.personal.address, keyName, "");
          isPrimary = (data.personal.address.primary === keyName) ? 1 : 0;
          addressKey = addressObj.key;
          countryName = Ember.getWithDefault(addressObj.country, "value", "");
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
        
        if(countryName === "" && Line1Val === "" && Line2Val === "" && Line3Val === "" && CityName === "" && PostalCodeName === "") {
          defaultAddressObj = Ember.getWithDefault(userInitialData.personal.address, keyName, "");
          addressKey = defaultAddressObj.key;
          countryName = defaultAddressObj.country.value;
          stateName = defaultAddressObj.state.value;
          Line1Val = defaultAddressObj.line1;
          Line2Val = defaultAddressObj.line2;
          Line3Val = defaultAddressObj.line3;
          CityName = defaultAddressObj.city;
          PostalCodeName = defaultAddressObj.zip;
          if(countryName === "" && Line1Val === "" && Line2Val === "" && Line3Val === "" && CityName === "" && PostalCodeName === "") {
            addressInfo.Addresses.Address[addressLength].Delete = 0;
          } else {
            addressInfo.Addresses.Address[addressLength].Delete = 1;
          }
        } else {
          addressInfo.Addresses.Address[addressLength].Delete = 0;
        }
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
        if((!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false) && Ember.getWithDefault(data.personal, "organization.isLinkedAccount", false)) || (data.personal.primaryAddress === "home" && data.personal.address.primary === "office" && !Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false))) {
          if(Ember.getWithDefault(data.personal.address, keyName, false) !== false) {
            addressObj = Ember.getWithDefault(data.personal.address, keyName, "");
            defaultAddressObj = Ember.getWithDefault(userInitialData.personal.address, keyName, "");
            isPrimary = (data.personal.address.primary === keyName) ? 1 : 0;
            addressKey = addressObj.key;
          } else {
            isPrimary = 0;
            addressKey = "";
          }
          address_owner_key = Ember.getWithDefault(data.personal, "address.office.address_owner_key", "");
          if(!Ember.getWithDefault(data.personal, "organization.isLinkedAccount", false) && address_owner_key !== "" && address_owner_key.toLowerCase() === membershipInfo.IndividualKey.toLowerCase()) {
            addressInfo.Addresses.Address[addressLength] = {};
            addressInfo.Addresses.Address[addressLength].TypeKey = Ember.getWithDefault(genericData.addresstypekeys, keyName, "");
            addressInfo.Addresses.Address[addressLength].IsPrimary = isPrimary;
            addressInfo.Addresses.Address[addressLength].Key = addressKey;
            addressInfo.Addresses.Address[addressLength].Country = Ember.getWithDefault(addressObj, "country.value", "");
            addressInfo.Addresses.Address[addressLength].State = Ember.getWithDefault(addressObj, "state.value", "");
            addressInfo.Addresses.Address[addressLength].Line1 = Ember.getWithDefault(addressObj, "line1", "");
            addressInfo.Addresses.Address[addressLength].Line2 = Ember.getWithDefault(addressObj, "line2", "");
            addressInfo.Addresses.Address[addressLength].Line3 = Ember.getWithDefault(addressObj, "line3", "");
            addressInfo.Addresses.Address[addressLength].City = Ember.getWithDefault(addressObj, "city", "");
            addressInfo.Addresses.Address[addressLength].PostalCode = Ember.getWithDefault(addressObj, "zip", "");
            addressInfo.Addresses.Address[addressLength].Delete = 0;
          } else {
            if(Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false)) {
              isPrimary = 0;
            }
            if((address_owner_key !== "" && address_owner_key.toLowerCase() !== membershipInfo.IndividualKey.toLowerCase()) || (data.personal.primaryAddress === "home" && data.personal.address.primary === "office" && !Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false))) {
              addressInfo.Addresses.Address[addressLength] = {};
              if(!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false) && (address_owner_key !== "" && address_owner_key.toLowerCase() !== membershipInfo.IndividualKey.toLowerCase())) {
                addressInfo.Addresses.Address[addressLength].CompanyKey = data.personal.organization.key;
              }
              addressInfo.Addresses.Address[addressLength].TypeKey = Ember.getWithDefault(genericData.addresstypekeys, keyName, "");
              addressInfo.Addresses.Address[addressLength].IsPrimary = isPrimary;
              addressInfo.Addresses.Address[addressLength].Key = addressKey;
              addressInfo.Addresses.Address[addressLength].Delete = 0;
            }
          }
        }
      }
    });
    if(Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false) || Ember.getWithDefault(data.personal, "organization.isLinkedAccount", false)) {
      if(address_owner_key !== "" && address_owner_key !== membershipInfo.IndividualKey) {
        organizationInfo.RelatedOrganizations = {};
        if(!Ember.getWithDefault(data.personal, "organizationInfo.isNewOrganization", false)) {
          organizationInfo.RelatedOrganizations.RelatedOrganization = {
            "Key" : data.personal.organization.key,
            "Delete": 0
          };
        } else {
          organizationInfo.RelatedOrganizations = {};
          organizationInfo.RelatedOrganizations.RelatedOrganization = {
            "Name": Ember.getWithDefault(data.personal, "organizationInfo.Name", ""),
            "Type": Ember.getWithDefault(data.personal, "organizationInfo.companyType", ""),
            "Delete": 0,
            "Website": Ember.getWithDefault(data.personal, "organizationInfo.Website", ""),
            "OrganizationAddress": {
              "TypeKey": Ember.getWithDefault(genericData.addresstypekeys, "office", ""),
              "Country": Ember.getWithDefault(data.personal, "organizationInfo.country.value", ""),
              "Delete": 0,
              "Line1": Ember.getWithDefault(data.personal, "organizationInfo.addressLine1", ""),
              "Line2": Ember.getWithDefault(data.personal, "organizationInfo.addressLine2", ""),
              "City": Ember.getWithDefault(data.personal, "organizationInfo.locality", ""),
              "State": Ember.getWithDefault(data.personal, "organizationInfo.workState.value", ""),
              "PostalCode": Ember.getWithDefault(data.personal, "organizationInfo.PostalCode", ""),
              "IsPrimary": (data.personal.address.primary === "office") ? 1 : 0
            },
            "OrganizationPhone": {
              "IsPrimary": (data.personal.phone.primary === "cell") ? 1 : 0,
              "Delete": 0,
              "TypeKey": Ember.getWithDefault(genericData.phonetypekeys, "cell", ""),
              "Number": Ember.getWithDefault(data.personal, "organizationInfo.orgPhone", "")
            }
          };
          if(Ember.getWithDefault(data.personal, "organizationInfo.country.value", "") === "UNITED STATES" || Ember.getWithDefault(data.personal, "organizationInfo.country.value", "") === "CANADA") {
            organizationInfo.RelatedOrganizations.RelatedOrganization.OrganizationAddress.State = Ember.getWithDefault(data.personal, "organizationInfo.workState.value", "");
          }
        }
      } else {
        organizationInfo.RelatedOrganizations = {};
        organizationInfo.RelatedOrganizations.RelatedOrganization = {
          "Name": Ember.getWithDefault(data.personal, "organizationInfo.Name", ""),
          "Type": Ember.getWithDefault(data.personal, "organizationInfo.companyType", ""),
          "Website": Ember.getWithDefault(data.personal, "organizationInfo.Website", ""),
          "Delete": 0,
          "OrganizationAddress": {
            "TypeKey": Ember.getWithDefault(genericData.addresstypekeys, "office", ""),
            "Delete": 0,
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
            "Delete": 0,
            "TypeKey": Ember.getWithDefault(genericData.phonetypekeys, "cell", ""),
            "Number": Ember.getWithDefault(data.personal, "organizationInfo.orgPhone", "")
          }
        };
      }
      //}
    } else {
      if(Ember.getWithDefault(data,'personal.organization.key', false)) {
        organizationInfo.RelatedOrganizations = {};
        organizationInfo.RelatedOrganizations.RelatedOrganization = {
          "Key" : data.personal.organization.key,
          "Delete": 0
        };
      }
    }
    membershipInfo = Object.assign(membershipInfo, membershipPackagesObj, duesInfo, paymentInfo, DonationInfo, installmentsInfo, otherInfo, personalInfo, phonesInfo, addressInfo, organizationInfo);
    
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
    Ember.$('.payment-loader').show();
    return fetch(`${ENV.AIA_SAVE_URL}`, saveRequestData).then(response => {
      if(response.status === 200) {
        return response.json();        
      } else {
        return {};
      }
    }).then((json) => {
      Ember.$('.payment-loader').hide();
      return json;
    });
  },
  updateChosen: function(){
    setTimeout(function(){
      $(".select-chosen").trigger("chosen:updated");
    },100);
  }.observes("data")
});