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
    primaryWorkAddress: false,
    createOrganization: false,
    contactAddressType: "",
    init: function () {
        "use strict";
        var self, primaryAddress, chapterType, contactInfo;
        self = this;
        self._super(...arguments);
        contactInfo = self.get('info.contactInfo');
        primaryAddress = self.get('info.primaryAddress');
        chapterType = primaryAddress.chaptersType.capitalize();
        self.chapterSelection(chapterType);
        if (primaryAddress.home.country === "UNITED STATES") {
            self.set('homeShowState', true);
        }
        self.set('contactAddressType', contactInfo.addressType);
    },
    prefixes: function () {
        "use strict";
        var data = [
            "Dr.",
            "Hon.",
            "Miss",
            "Mr.",
            "Mrs.",
            "Ms.",
            "Rev."
        ];
        return data;
    }.property(),
    suffixes: function () {
        "use strict";
        var data = [
            "Esq.",
            "II",
            "III",
            "IV",
            "Jr.",
            "Sr.",
            "V"
        ];
        return data;
    }.property(),
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
        var primaryAddress, self;
        self = this;
        self.set('primaryHomeAddress', false);
        self.set('primaryWorkAddress', false);
        self.set('createOrganization', false);
        primaryAddress = self.get('info.primaryAddress');
        self.set('primary' + chapterType + 'Address', true);
        if (primaryAddress.showWorkAddress === true) {
            self.set('primaryWorkAddress', true);
        }
        if (primaryAddress.showHomeAddress === true) {
            self.set('primaryHomeAddress', true);
        }
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
            if (value === "UNITED STATES") {
                this.set("workShowState", true);
            } else {
                this.set("workShowState", false);
            }
        },
        setHomeStateStatus: function (value) {
            "use strict";
            if (value === "UNITED STATES") {
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
                      lettersonly: true
                    },
                    middlename: {
                      lettersonly: true
                    },
                    lastname: {
                      required: true,
                      lettersonly: true
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
                    work_number: {
                      required: function() {
                        return $("#primary_number_work").is(":checked");
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
                        return $("#choose_chapter_home").is(":checked");
                      }
                    },
                    administrative_area_state: {
                      required: function() {
                        return $("#choose_chapter_home").is(":checked") && $("#primary_home_address_country").val() === "UNITED STATES";
                      }
                    }
                },
                messages: {
                    prefix: "Please select valid Prefix",
                    firstname: {
                      required: "Please enter your Firstname",
                      lettersonly: "Special characters not allowed for Firstname"
                    },
                    middlename: {
                      lettersonly: "Please enter a single letter for your middle initial"
                    },
                    lastname: {
                      required: "Please enter your Lastname",
                      lettersonly: "Special characters not allowed for Lastname"
                    },
                    contact_home_country: "Please select country",
                    contact_mobile_country: "Please select country",
                    contact_work_country: "Please select country",
                    home_number: "Please Enter Valid Phone Number",
                    mobile_number: "Please Enter Valid Mobile Number",
                    work_number: "Please Enter Valid Work Number",
                    primary_home_address_country: "Please Select Country"
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
                    return $("#create_org_country").val() === "UNITED STATES";
                  },
                  org_company_phone: {
                    digits: true,
                    minlength: 6
                  }
                },
                messages: {
                  organization_name: "Please enter organization name",
                  company_type: "Please select Company Type",
                  create_org_country: "Please select country",
                  org_company_address1: "Please enter company address",
                  org_locality: "Please enter city",
                  work_administrative_state: "Please select state",
                  org_company_phone: {
                    digits: "Pleas enter valid phone number"
                  }
                }
            });
            if(validate.form()) {
                //this.get('router').transitionTo('membership-dues');
            }
        }
    }
});
