import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    this.modelFor("application").class = "no-sidebars page-renew-verify-personal-contact-info";
  },
  model() {
    return Ember.RSVP.hash({
      steps: [
        {
          "title": "Step 1. Primary information",
          "status": "step-active",
          "route": "primary-information"
        },
        {
          "title": "Step 2. Membership dues",
          "status": "",
          "route": "membership-dues"
        },
        {
          "title": "Step 3. Payment",
          "status": "",
          "route": "payment-information"
        }
      ],
      page: {
        "test": "hello world",
        "information":[
          {
            "title": "",
            "value": "Mrs. Thomas Y Sda II",
            "class": "full-name"
          },
          {
            "title": "Home phone",
            "value": "31243245325",
            "class": "home-phone",
            "isPrimary": true
          },
          {
            "title": "Mobile phone",
            "value": "1243455453",
            "class": "mobile-phone"
          },
          {
            "title": "Work phone",
            "value": "2133273876",
            "class": "work-phone"
          },
          {
            "title": "address",
            "value": [
              "39 Argoswerq",
              "ewr",
              "Laguna Niguel, CA, UNITED STATES 92677-9002"
            ],
            "class": "address"
          }
        ],
        "primaryInformation": {
          "personalInfo" : {
            "prefix": "Mrs.",
            "firstName": "Thomas",
            "middleName": "Y",
            "lastName": "Sda",
            "suffix": "II"
          }
        }
      }
    });
  }
});
