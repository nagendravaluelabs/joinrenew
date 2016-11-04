/*jslint white:true, devel:true, es6:true, this:true, browser:true */
/*global jQuery*/
import Ember from "ember";
import rememberScroll from "../mixins/remember-scroll";
const {$} = Ember;
jQuery.validator.addMethod("acceptReg", function (value, element, param) {
    "use strict";
    return value.match(new RegExp("." + param + "$"));
});

jQuery.validator.addMethod( "zipcodeUS", function( value, element ) {
    "use strict";
	  return this.optional( element ) || /^\d{5}(-\d{4})?$/.test( value );
},  "Please enter a valid US zip code. The format should be either 00000 or 00000-0000." );

jQuery.validator.addMethod("zipcodeCA", function(value, element) {
    return this.optional(element) || /^[a-z0-9\A-Z0-9\-\s]+$/i.test(value
    );
}, "Please enter a valid zip code" );

jQuery.validator.addMethod( "alphanumeric", function( value, element ) {
	return this.optional( element ) || /^[a-z0-9\-\s]+$/i.test( value );
}, "Special characters not allowed" );

jQuery.validator.addMethod("url", function(value, element) { 
	return this.optional( element ) || /^(?:(?:(?:https?:\/\/|www\.)))(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test( value );
}, "Please enter a valid URL.");

export default Ember.Component.extend(rememberScroll, {
    workShowState: false,
    homeShowState: false,
    primaryHomeAddress: false,
    primaryWorkAddress: false,
    createOrganization: false,
    contactAddressType: "",
    genericData: Ember.inject.service('generic-data'),
    statesData: Ember.inject.service('states-data'),
    workstates: {},
    homeStates: [],
    isHomeUSA: false,
    isHomeCanada: false,
    isWorkUSA: false,
    isWorkCanada: false,
    init: function () {
        "use strict";
        this._super(...arguments);
        this.serviceLoad();
    },
    serviceLoad: function () {
        "use strict";
        var self, primaryAddress, chapterType, contactInfo;
        self = this;
        contactInfo = self.get('personalInfo.personal.phone');
        primaryAddress = self.get('personalInfo');
        if (typeof primaryAddress.personal !== "undefined") {
            primaryAddress = primaryAddress.personal.address;
            if(primaryAddress.primary) {
              chapterType = primaryAddress.primary.capitalize();
              chapterType = (chapterType === "Billing") ? "Home" : chapterType;
              chapterType = (chapterType === "Office") ? "Work" : chapterType;
              self.chapterSelection(chapterType);
            }
            if(Ember.getWithDefault(primaryAddress, "home.country.key", false)) {
              self.setHomeStateStatusFn(primaryAddress.home.country.key.toLowerCase(), true);
            }
            self.set('contactAddressType', contactInfo.primary);
        }
    },
    controllerLoadObserves: function () {
        "use strict";
        this.serviceLoad();
    }.observes("personalInfo"),
    addressType: function () {
        "use strict";
        var data = [
            "home",
            "mobile",
            "work"
        ];
        return data;
    }.property(),
    chaptersType: function () {
        "use strict";
        var data = [
            "home",
            "work"
        ];
        return data;
    }.property(),
    companyType: function () {
        "use strict";
        var data = [
            "Advertising",
            "Architecture Firm",
            "Building Product Manufacturer",
            "Construction Firm",
            "Consulting Firm",
            "Contractor",
            "Design &amp; Construction Services",
            "Design-Build"
        ];
        return data;
    }.property(),
    chapterSelection: function (chapterType) {
        "use strict";
        var self;
        self = this;
        chapterType = (chapterType === "Directoffice" || chapterType === "Office") ?  "Work" : chapterType;
        self.set('primaryHomeAddress', false);
        self.set('primaryWorkAddress', false);
        self.set('createOrganization', false);
        self.set('primary' + chapterType + 'Address', true);
    },
    countryObserver: function() {
      var countryKey, countryCode, genericData;
      countryKey = this.get("personalInfo.personal.address.home.country.key");
      genericData = this.get("genericData.generic.country");
      countryCode = genericData.map(function(list){ 
        if(list.countrykey.toLowerCase() === countryKey.toLowerCase()) {
          return list.countrycode;
        } else {
          return null;
        }
      });
      countryCode = countryCode.filter(function(n){ return n !== null; }); 
      countryCode = countryCode[0];
      this.set("personalInfo.personal.address.home.country.value", countryCode);
    }.observes('personalInfo.personal.address.home.country.key'),
    stateObserver: function() {
      var stateKey, stateCode, genericData, countryValue;
      countryValue = this.get("personalInfo.personal.address.home.country.value");
      stateKey = this.get("personalInfo.personal.address.home.state.key");
      genericData = this.get("genericData.generic.states");
      if(countryValue === "UNITED STATES") {
        genericData = genericData["UNITED STATES"];        
      }else if(countryValue === "CANADA") {
        genericData = genericData["CANADA"]; 
      } else {
        genericData = [];
      }
      stateCode = genericData.map(function(list){ 
        if(list.statekey.toLowerCase() === stateKey.toLowerCase()) {
          return list.statecode;
        } else {
          return null;
        }
      });
      stateCode = stateCode.filter(function(n){ return n !== null; }); 
      stateCode = stateCode[0];
      this.set("personalInfo.personal.address.home.state.value", stateCode);
    }.observes('personalInfo.personal.address.home.state.key'),
    workCountryObserver: function() {
      var countryKey, countryCode, genericData;
      countryKey = this.get("organizationInfo.country.key");
      genericData = this.get("genericData.generic.country");
      countryCode = genericData.map(function(list){ 
        if(list.countrykey.toLowerCase() === countryKey.toLowerCase()) {
          return list.countrycode;
        } else {
          return null;
        }
      });
      countryCode = countryCode.filter(function(n){ return n !== null; }); 
      countryCode = countryCode[0];
      this.set("organizationInfo.country.value", countryCode);
    }.observes('organizationInfo.country.key'),
    workStateObserver: function() {
      var stateKey, stateCode, genericData, countryValue;
      countryValue = this.get("organizationInfo.country.value");
      stateKey = this.get("organizationInfo.workState.key");
      if(stateKey !== undefined && stateKey !== "") {
        genericData = this.get("genericData.generic.states");
        if(countryValue === "UNITED STATES") {
          genericData = genericData["UNITED STATES"];        
        }else if(countryValue === "CANADA") {
          genericData = genericData["CANADA"]; 
        }
        stateCode = genericData.map(function(list){ 
          if(list.statekey.toLowerCase() === stateKey.toLowerCase()) {
            return list.statecode;
          } else {
            return null;
          }
        });
        stateCode = stateCode.filter(function(n){ return n !== null; }); 
        stateCode = stateCode[0];
        this.set("organizationInfo.workState.value", stateCode);
      }
    }.observes('organizationInfo.workState.key'),
    setWorkStateStatusFn: function (value, mode) {
        "use strict";
        var self, data, validCountries;
        self = this;
        mode = (typeof mode === "undefined") ? false : mode;
        validCountries = ["bc4b70f8-280e-4bb0-b935-9f728c50e183","be685760-5492-4ba3-b105-868e2010fa34"];
        value = (typeof value === "undefined") ? "" : value.toLowerCase();
        if(value !== "" && validCountries.indexOf(value) !== -1) {
          data = self.get("statesData").getStateData(value);
          if(data.type === "data") {
            self.set("workstates", data.info);
          } else {
            data.info.then(function(output){
              self.set("workstates", output);
              self.get("statesData").setStateData(value, output);
            });
          }
        } else {
          self.set("workstates", []);
        }
        self.set("organizationInfo.workState", {value: "", key: ""});
        if(value === "be685760-5492-4ba3-b105-868e2010fa34") {
          self.set("isWorkCanada", true);
          self.set("isWorkUSA", false);
        } else if(value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
          self.set("isWorkCanada", false);
          self.set("isWorkUSA", true);
        } else {
          self.set("isWorkCanada", false);
          self.set("isWorkUSA", false);
        }
        if (validCountries.indexOf(value) !== -1) {
            this.set("workShowState", true);
        } else {
            this.set("workShowState", false);
        }
        Ember.$("#work_administrative_state").trigger("change");
        /*
        if(!mode) {
          this.set("organizationInfo.addressLine1", "");
          this.set("organizationInfo.addressLine2", "");
          this.set("organizationInfo.locality", "");
          this.set("organizationInfo.workState", "");
          this.set("organizationInfo.postalCode", "");
        }*/
    },
    setHomeStateStatusFn: function (value, mode) {
        "use strict";
        var self, data, validCountries;
        self = this;
        mode = (typeof mode === "undefined") ? false : mode;
        validCountries = ["bc4b70f8-280e-4bb0-b935-9f728c50e183","be685760-5492-4ba3-b105-868e2010fa34"];
        value = (typeof value === "undefined") ? "" : value.toLowerCase();
        if(value !== "" && validCountries.indexOf(value) !== -1) {
          data = self.get("statesData").getStateData(value);
          if(data.type === "data") {
            self.set("homeStates", data.info);
          } else {
            data.info.then(function(output){
              self.set("homeStates", output);
              self.get("statesData").setStateData(value, output);
            });
          }
        } else {
          self.set("homeStates", []);
        }
        if(value.toLowerCase() === "be685760-5492-4ba3-b105-868e2010fa34") {
          self.set("isHomeCanada", true);
          self.set("isHomeUSA", false);
        } else if(value.toLowerCase() === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
          self.set("isHomeCanada", false);
          self.set("isHomeUSA", true);
        } else {
          self.set("isHomeCanada", false);
          self.set("isHomeUSA", false);
        }
        if (validCountries.indexOf(value) !== -1) {
            this.set("homeShowState", true);
        } else {
            this.set("homeShowState", false);
        }
        if(!mode) {
          this.set("personalInfo.personal.address.home.state.key", "");
          this.set("personalInfo.personal.address.home.state.value", "");
          this.set("personalInfo.personal.address.home.line1", "");
          this.set("personalInfo.personal.address.home.line2", "");
          this.set("personalInfo.personal.address.home.city", "");
          this.set("personalInfo.personal.address.home.zip", "");
        }
        Ember.$("#administrative_area_state").trigger("change");
    },
        validatePersonalInfo: function (mode) {
            "use strict";
            mode = (typeof mode !== undefined) ? mode : false;
            if(this.get("editContactInfo")) {
              var validate;
              validate = $("#personal-contact-form").validate({
                  rules: {
                      firstname: {
                          required: true,
                          letterswithbasicpunc: true
                      },
                      middlename: {
                          letterswithbasicpunc: true
                      },
                      lastname: {
                          required: true,
                          letterswithbasicpunc: true
                      },
                      contact_home_country: {
                          required: true
                      },
                      contact_mobile_country: {
                          required: function () {
                              //return $("#primary_number_mobile").is(":checked");
                              if($("#primary_number_mobile").is(":checked")){
                                return true;
                              } else if($("#contact_mobile_country").val() !== "" || ($("#mobile_number").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                          }
                      },
                      contact_work_country: {
                          required: function () {
                              //return $("#primary_number_work").is(":checked");
                              if($("#primary_number_work").is(":checked")){
                                return true;
                              } else if($("#contact_work_country").val() !== "" || ($("#work_number").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                          }
                      },
                      home_number: {
                          required: true,
                          digits: true,
                          maxlength: 15
                      },
                      mobile_number: {
                          required: function () {
                              //return $("#primary_number_mobile").is(":checked");
                              if($("#primary_number_mobile").is(":checked")){
                                return true;
                              } else if($("#contact_mobile_country").val() !== "" || ($("#mobile_number").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                          },
                          digits: true,
                          maxlength: 15
                          
                      },
                      work_number: {
                          required: function () {
                              //return $("#primary_number_work").is(":checked");
                              if($("#primary_number_work").is(":checked")){
                                return true;
                              } else if($("#contact_work_country").val() !== "" || ($("#work_number").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                          },
                          digits: true,
                          maxlength: 15
                      },
                      primary_home_address_country: {
                          required: function () {
                              return $("#choose_chapter_home").is(":checked");
                          }
                      },
                      primary_home_address1: {
                          required: function () {
                              return $("#choose_chapter_home").is(":checked");
                          }
                      },
                      primary_home_city: {
                          required: function () {
                              return $("#choose_chapter_home").is(":checked");
                          }
                      },
                      primary_home_zipcode: {
                          required: function () {
                              return $("#choose_chapter_home").is(":checked") && ($("#primary_home_address_country").val().toLowerCase() === "bc4b70f8-280e-4bb0-b935-9f728c50e183" || $("#primary_home_address_country").val().toLowerCase() === "be685760-5492-4ba3-b105-868e2010fa34");
                          },
                          alphanumeric:true,
                          maxlength:10
                      },
                      administrative_area_state: {
                          required: function () {
                            return $("#choose_chapter_home").is(":checked") && ($("#primary_home_address_country").val().toLowerCase() === "bc4b70f8-280e-4bb0-b935-9f728c50e183" || $("#primary_home_address_country").val().toLowerCase() === "be685760-5492-4ba3-b105-868e2010fa34");
                          }
                      },
                      org_work_address: {
                        required: function () {
                            return $("#choose_chapter_work").is(":checked");
                          }
                      }
                  },
                  messages: {
                      prefix: "Prefix is required",
                      firstname: {
                          required: "First name is required",
                          letterswithbasicpunc: "Special characters not allowed for First name"
                      },
                      middlename: {
                          letterswithbasicpunc: "Please enter a single letter for your middle initial"
                      },
                      lastname: {
                          required: "Last name is required",
                          letterswithbasicpunc: "Special characters not allowed for last name"
                      },
                      contact_home_country: "Country field is required",
                      contact_mobile_country: "Country field is required",
                      contact_work_country: "Country field is required",
                      home_number: {
                          required: "Home number is required",
                          digits: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555",
                          maxlength: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555"
                      },
                      mobile_number: {
                          required: "Mobile number is required",
                          digits: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555",
                          maxlength: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555"
                      },
                      work_number: {
                          required: "Work number is required",
                          digits: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555",
                          maxlength: "Please enter a valid phone number with no special characters or spaces. Example: 555555555555555"
                      },
                      primary_home_address_country: "Country field is required",
                      primary_home_address1: "Address line1 is required",
                      primary_home_city: "City is required",
                      administrative_area_state:  {
                        required: function() {
                          if($("#primary_home_address_country").val().toLowerCase() === "be685760-5492-4ba3-b105-868e2010fa34") {
                            return "Province is required";
                          } else {
                            return "State is required";
                          }
                        }
                      },
                      primary_home_zipcode: {
                        required : "Zip code is required",
                        alphanumeric : "Please enter a valid zip code",
                        maxlength: "Please enter a valid zip code"
                      },
                      org_work_address: {
                        required : "Please Add / select your Organization details",
                      }                     
                  }
              });
              if (validate.form()) {
                  if(!mode) {
                    this.sendAction("savePersonalInfo", this.get("personalInfo"), true);
                  } else {
                    this.sendAction("savePersonalInfo", this.get("personalInfo"), false);
                    this.sendAction("showPersonalInfo", true);
                  }
              } else {
                  if ($("#personal-contact").hasClass("hidden")) {
                      this.sendAction("showPersonalInfo");
                  }            
              }
            } else {
                this.sendAction("savePersonalInfo", this.get("personalInfo"), true);
            }
        },
    actions: {
        showPersonalInfo: function () {
            "use strict";
            this.validatePersonalInfo(true);
        },
        chapterSelection: function (value) {
            "use strict";
            var self;
            self = this;
            $(".primary-action-btn").removeClass("hidden");
            self.set('createOrganization', false);
            self.chapterSelection(value.capitalize());
        },
        createNewOrganization: function () {
            "use strict";
            var self, value;
            self = this;
            value = self.get('createOrganization');
            if(!self.get("organizationInfo.isNewOrganization")) {
              self.setWorkStateStatusFn("bc4b70f8-280e-4bb0-b935-9f728c50e183");
              self.set("organizationInfo.Name", "");
              self.set("organizationInfo.Website", "");
              self.set("organizationInfo.companyType", "");
              self.set("organizationInfo.orgPhone", "");
              //self.set("organizationInfo.country.key", "bc4b70f8-280e-4bb0-b935-9f728c50e183");
              //self.set("organizationInfo.countryCode", "bc4b70f8-280e-4bb0-b935-9f728c50e183");
              
              self.set("organizationInfo.addressLine1", "");
              self.set("organizationInfo.addressLine2", "");
              self.set("organizationInfo.locality", "");
              self.set("organizationInfo.workState", {value:"", key: ""});
              self.set("organizationInfo.PostalCode", "");
              self.set("organizationInfo.isNewOrganization", false);
            }
            if (value) {
                $(".primary-action-btn").removeClass("hidden");
                self.set('createOrganization', false);
            } else {
                $(".primary-action-btn").addClass("hidden");
                self.set('createOrganization', true);
            }
        },
        setWorkStateStatus: function (value) {
            "use strict";
            this.setWorkStateStatusFn(value);
        },
        setHomeStateStatus: function (value) {
            "use strict";
            this.setHomeStateStatusFn(value);
        },
        updateContactInformation: function (value) {
            "use strict";
            $(".your-contact-info .chosen-container").removeClass("error");
            $(".your-contact-info .chosen-container + label.error").hide();
            this.set('contactAddressType', value);
        },
        validatePersonalInfo: function () {
            "use strict";
            this.validatePersonalInfo();
        },
        addNewOrganization: function () {
            "use strict";
            var validator;
            validator = $("#addNewOrganization").validate({
                rules: {
                    org_website: {
                        url: true
                    },
                    work_administrative_state: {
                        required: function () {
                            return ($("#create_org_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183" || $("#create_org_country").val() === "be685760-5492-4ba3-b105-868e2010fa34");
                        }
                    },
                    org_company_phone: {
                        digits: true,
                        required: function(){
                           if($("#create_org_code__country").val() !== "" || ($("#org_company_phone").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                        }
                    },
                    create_org_code__country:{
                        required: function(){
                           if($("#create_org_code__country").val() !== "" || ($("#org_company_phone").val() !== "")){
                                return true;
                              } else{
                              return false;
                              }
                        }
                      
                    },
                    primary_work_zipcode: {
                      required: function () {
                            return $("#create_org_country").val().toLowerCase() === "bc4b70f8-280e-4bb0-b935-9f728c50e183" || $("#create_org_country").val().toLowerCase() === "be685760-5492-4ba3-b105-868e2010fa34";
                      },
                      alphanumeric:true,
                      maxlength:10
                    }
                },
                messages: {
                    organization_name: "Organization Name is required",
                    company_type: "Company Type is required",
                    create_org_country: "Country is required",
                    create_org_code__country: "Country code is required",
                    org_company_address1: "Address line1 is required",
                    org_locality: "City is required",
                    work_administrative_state: {
                      required: function() {
                        if($("#create_org_country").val() === "be685760-5492-4ba3-b105-868e2010fa34") {
                          return "Province is required";
                        } else {
                          return "State is required";
                        }
                      }
                    },
                    org_company_phone: {
                        digits: "Please enter a valid Company phone number",
                        required : function(){
                          if($("#org_company_phone").val() === ""){
                                return "Company Phone is required";
                              } else{
                              return " feild is required";
                              }
                        }
                    },
                    primary_work_zipcode:{
                      required : "Zip code is required",
                      alphanumeric : "Please enter a valid zip code",
                      maxlength: "Please enter a valid zip code"
                    }
                }
            });
            if (validator.form()) {
                this.set("personalInfo.personal.organization.name", this.get("organizationInfo.Name"));
                this.set("personalInfo.personal.organization.key", this.get("organizationInfo.Name"));
                this.set("personalInfo.personal.address.office.key", this.get("organizationInfo.Name"));
                this.set("personalInfo.personal.organization.isLinkedAccount", false);
                this.set("personalInfo.personal.organization.linkedAddress", "");
                this.set("organizationInfo.isNewOrganization", true);
                this.send("createNewOrganization", true);
            }
        },
        chosenValueChanged: function(value, param) {
          param.set("value", value);
        },
        selectedCompanyDetails: function(value) {
          Ember.$(".hypersearch-input").val('');
          $(".primary-action-btn").removeClass("hidden");
          this.set('createOrganization', false);
          this.set("personalInfo.personal.organization.name", Ember.getWithDefault(value, "attributes.name", ""));
          this.set("personalInfo.personal.organization.key", Ember.getWithDefault(value, "id", ""));
          //this.set("personalInfo.personal.address.office.key", Ember.getWithDefault(value, "id", ""));
          this.set("personalInfo.personal.organization.isLinkedAccount", true);
          this.set("personalInfo.personal.organization.linkedAddress", Ember.getWithDefault(value, "attributes", ""));
          this.set("personalInfo.personal.address.office.key", Ember.getWithDefault(value, "attributes.address_key", "2BBFE3AA-3242-4105-9E89-6E880FC87518"));
          this.set("personalInfo.personal.address.office.address_owner_key", Ember.getWithDefault(value, "id", ""));
          this.setWorkStateStatusFn("bc4b70f8-280e-4bb0-b935-9f728c50e183");
          
          this.set("organizationInfo.Name", "");
          this.set("organizationInfo.Website", "");
          this.set("organizationInfo.companyType", "");
          this.set("organizationInfo.orgPhone", "");
          //this.set("organizationInfo.country.key", "bc4b70f8-280e-4bb0-b935-9f728c50e183");
          //this.set("organizationInfo.countryCode", "bc4b70f8-280e-4bb0-b935-9f728c50e183");
          
          this.set("organizationInfo.addressLine1", "");
          this.set("organizationInfo.addressLine2", "");
          this.set("organizationInfo.locality", "");
          this.set("organizationInfo.workState", {value: "", key: ""});
          this.set("organizationInfo.PostalCode", "");
          this.set("organizationInfo.isNewOrganization", false);
        }
    }
});
