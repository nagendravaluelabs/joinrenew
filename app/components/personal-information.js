/*jslint es6, this*/
import Ember from "ember";
const {$} = Ember;

export default Ember.Component.extend({
    workShowState: false,
    homeShowState: false,
    primaryHomeAddress: false,
    primaryWorkAddress: false,
    createOrganization: false,
    init: function () {
        "use strict";
        var self, primaryAddress, chapterType;
        self = this;
        self._super(...arguments);
        primaryAddress = self.get('info.primaryAddress');
        chapterType = primaryAddress.chaptersType.capitalize();
        self.chapterSelection(chapterType);
        if (primaryAddress.home.country === "UNITED STATES") {
            self.set('homeShowState', true);
        }
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
        chapterSelection: function (value) {
            "use strict";
            var self;
            self = this;
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
        validatePersonalInfo: function () {
            var validate;
            validate = $("#personal-contact-form").validate({
                rules:{
                    prefix: "required",
                    lastname: "required",
                    suffix: "required"
                },
                messages: {
                    prefix: "Please select valid Prefix",
                    lastname:"Please enter your Lastname",
                    prefix: "Please select valid Suffix"
                }
            });
            if(validate.form()) {
                this.get('router').transitionTo('membership-dues');
            }
        }
    }
});
