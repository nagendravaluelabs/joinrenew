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

jQuery.validator.addMethod( "alphanumeric", function( value, element ) {
	return this.optional( element ) || /^[a-z0-9\-\s]+$/i.test( value );
}, "Special characters not allowed" );

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
            chapterType = primaryAddress.primary.capitalize();
            chapterType = (chapterType === "Billing") ? "Home" : chapterType;
            chapterType = (chapterType === "Office") ? "Work" : chapterType;
            self.chapterSelection(chapterType);
            if(Ember.getWithDefault(primaryAddress, "home.country.key", false)) {
              self.setHomeStateStatusFn(primaryAddress.home.country.key.toLowerCase());              
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
      var stateKey, stateCode, genericData;
      stateKey = this.get("personalInfo.personal.address.home.state.key");
      genericData = this.get("genericData.generic.states");
      genericData = genericData["UNITED STATES"];
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
    setWorkStateStatusFn: function (value) {
        "use strict";
        var self, data;
        self = this;
        value = (typeof value === "undefined") ? "" : value;
        if(value !== "" && value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
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
        if (value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
            this.set("workShowState", true);
        } else {
            this.set("workShowState", false);
        }
    },
    setHomeStateStatusFn: function (value) {
        "use strict";
        var self, data;
        self = this;
        value = (typeof value === "undefined") ? "" : value;
        if(value !== "" && value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
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
        if (value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
            this.set("homeShowState", true);
        } else {
            this.set("homeShowState", false);
        }
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
                              return $("#primary_number_mobile").is(":checked");
                          }
                      },
                      contact_work_country: {
                          required: function () {
                              return $("#primary_number_work").is(":checked");
                          }
                      },
                      home_number: {
                          required: true,
                          digits: true,
                          maxlength: 15
                      },
                      mobile_number: {
                          required: function () {
                              return $("#primary_number_mobile").is(":checked");
                          },
                          digits: true,
                          maxlength: 15
                          
                      },
                      work_number: {
                          required: function () {
                              return $("#primary_number_work").is(":checked");
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
                              return $("#choose_chapter_home").is(":checked") && $("#primary_home_address_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
                          },
                          alphanumeric:true,
                          maxlength:10
                      },
                      administrative_area_state: {
                          required: function () {
                              return $("#choose_chapter_home").is(":checked") && $("#primary_home_address_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
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
                      administrative_area_state: "State is required",
                      primary_home_zipcode: {
                        required : "Zip code is required",
                        alphanumeric : "Please enter a valid zip code",
                        maxlength: "Please enter a valid zip code"
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
            self.setWorkStateStatusFn("bc4b70f8-280e-4bb0-b935-9f728c50e183");
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
                            return $("#create_org_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
                        }
                    },
                    org_company_phone: {
                        digits: true
                        
                    },
                    postal_code: {
                      required: function () {
                            return $("#create_org_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
                      },
                      alphanumeric:true,
                      maxlength:10
                    }
                },
                messages: {
                    organization_name: "Organization Name is required",
                    company_type: "Company Type is required",
                    create_org_country: "Country is required",
                    org_company_address1: "Address line1 is required",
                    org_locality: "City is required",
                    work_administrative_state: "State is required",
                    org_company_phone: {
                        digits: "Please enter a valid Company phone number"
                    },
                    postal_code:{
                      required : "Zip code is required",
                      alphanumeric : "Please enter a valid zip code",
                      maxlength: "Please enter a valid zip code"
                    }
                }
            });
            if (validator.form()) {
                console.log("success");
            } else {
              console.log("error");
            }
        },
        chosenValueChanged: function(value, param) {
          param.set("value", value);
        }
    }
});
