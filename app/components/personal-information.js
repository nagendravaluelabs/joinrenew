/*jslint es6, this*/
import Ember from "ember";
import rememberScroll from "../mixins/remember-scroll";

const {$} = Ember;
jQuery.validator.addMethod("acceptReg", function(value, element, param) {
  return value.match(new RegExp("." + param + "$"));
});
export default Ember.Component.extend(rememberScroll, {
    workShowState: false,
    homeShowState: false,
    primaryHomeAddress: false,
    primaryOfficeAddress: false,
    createOrganization: false,
    contactAddressType: "",
    genericData: Ember.inject.service('generic-data'),
    statesData: Ember.inject.service('states-data'),
    init: function() {
      this._super(...arguments);
      this.serviceLoad();
    },
    serviceLoad: function () {
        "use strict";
        var self, primaryAddress, chapterType, contactInfo;
        self = this;
        contactInfo = self.get('personalInfo.personal.phone');
        primaryAddress = self.get('personalInfo');
        if(typeof primaryAddress.personal!="undefined") {
          primaryAddress = primaryAddress.personal.address;
          chapterType = primaryAddress.primary.capitalize();
          self.chapterSelection(chapterType);
          if (primaryAddress.home.country.key.toLowerCase() === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
              self.set('homeShowState', true);
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
            "directoffice"
        ];
        return data;
    }.property(),
    chaptersType: function () {
        "use strict";
        var data = [
            "home",
            "office"
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
        self.set('primaryHomeAddress', false);
        self.set('primaryOfficeAddress', false);
        self.set('createOrganization', false);
        //primaryAddress = self.get('personalInfo.personal.address');
        self.set('primary' + chapterType + 'Address', true);
        /*if (primaryAddress.primary === "office") {
            self.set('primaryOfficeAddress', true);
        }
        if (primaryAddress.primary === "home") {
            self.set('primaryHomeAddress', true);
        }*/
    },
    actions: {
        showPersonalInfo: function () {
            this.sendAction("showPersonalInfo");
            this.scrollToTop();
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
            if (value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
                this.set("workShowState", true);
            } else {
                this.set("workShowState", false);
            }
        },
        setHomeStateStatus: function (value) {
            "use strict";
            if (value === "bc4b70f8-280e-4bb0-b935-9f728c50e183") {
                this.set("homeShowState", true);
            } else {
                this.set("homeShowState", false);
            }
        },
        updateContactInformation: function (value) {
          $(".your-contact-info .chosen-container").removeClass("error");
          $(".your-contact-info .chosen-container + label.error").hide();
          this.set('contactAddressType', value);
        },
        validatePersonalInfo: function () {
            var validate;
            validate = $("#personal-contact-form").validate({
                rules:{
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
                      required: function() {
                        return $("#primary_number_home").is(":checked");
                      }
                    },
                    contact_mobile_country: {
                      required: function() {
                        return $("#primary_number_mobile").is(":checked");
                      }
                    },
                    contact_work_country: {
                      required: function() {
                        return $("#primary_number_work").is(":checked");
                      }
                    },
                    home_number: {
                      required: function() {
                        return $("#primary_number_home").is(":checked");
                      },
                      digits: true,
                      minlength: 10
                    },
                    mobile_number: {
                      required: function() {
                        return $("#primary_number_mobile").is(":checked");
                      },
                      digits: true,
                      minlength: 10
                    },
                    directoffice_number: {
                      required: function() {
                        return $("#primary_number_directoffice").is(":checked");
                      },
                      digits: true,
                      minlength: 10
                    },
                    primary_home_address_country: {
                      required: function() {
                        return $("#choose_chapter_home").is(":checked");
                      }
                    },
                    primary_home_address1: {
                      required: function() {
                        return $("#choose_chapter_home").is(":checked");
                      }
                    },
                    primary_home_city: {
                      required: function() {
                        return $("#choose_chapter_home").is(":checked");
                      }
                    },
                     primary_home_zipcode: {
                      required: function() {
                        return $("#choose_chapter_home").is(":checked") && $("#primary_home_address_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
                      }
                    }, 
                    administrative_area_state: {
                      required: function() {
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
                      digits: "Please enter a valid phone number with no special characters or spaces. Example: 5555555555"
                    },
                    mobile_number: {
                      required: "Mobile number is required",
                      digits: "Please enter a valid phone number with no special characters or spaces. Example: 5555555555"
                    },
                    directoffice_number: {
                      required: "Office number is required",
                      digits: "Please enter a valid phone number with no special characters or spaces. Example: 5555555555"
                    },
                    primary_home_address_country: "Country field is required",
                    primary_home_address1: "Address line1 is required",
                    primary_home_city: "City is required",
                    primary_home_zipcode: "Zip code is required"
                }
            });
            if(validate.form()) {
                this.get('router').transitionTo('membership-dues');
            } else {
                if($("#personal-contact").hasClass("hidden"))
                  this.sendAction("showPersonalInfo");
            }
        },
        addNewOrganization: function () {
            var validate;
            validate = $("#addNewOrganization").validate({
                rules: {
                  org_website: {
                    url: true
                  },
                  work_administrative_state: function(){
                    return $("#create_org_country").val() === "bc4b70f8-280e-4bb0-b935-9f728c50e183";
                  },
                  org_company_phone: {
                    digits: true,
                    minlength: 6
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
                  }
                }
            });
            if(validate.form()) {
                //this.get('router').transitionTo('membership-dues');
            }
        }
    }
});
