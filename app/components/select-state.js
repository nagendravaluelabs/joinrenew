import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  states: function() {
    var data = [
      {
        name: "Armed Forces Americas (except Canada)",
        id: "a30f212c-49bb-4f90-a46d-21728ebef42e"
      },
      {
        name: "Armed Forces Africa, Canada, Europe and Middle East",
        id: "91ff05d5-5ec7-41bf-8d25-15e3585f0c30"
      },
      {
        name: "Alaska",
        id: "8475071b-d56c-4112-ad81-9152696788c8"
      },
      {
        name: "Alabama",
        id: "13b42082-bc34-42a1-b15d-7ee7e06c9ee1"
      },
      {
        name: "Armed Forces Pacific",
        id: "f8d9368b-bc4d-47dc-962b-042aae76e904"
      },
      {
        name: "Arkansas",
        id: "77769aeb-a72c-4d2f-b7f1-65c429c06664"
      },
      {
        name: "American Samoa",
        id: "11249176-35b6-4444-9b2e-9bc29df6f261"
      },
      {
        name: "Arizona",
        id: "ee6ffe10-cdc2-4c30-b00c-6013d6f466ed"
      },
      {
        name: "California",
        id: "6915afa2-c832-4ea3-a88b-1504a238816b"
      },
      {
        name: "Colorado",
        id: "4ab93a15-fd3e-4e25-aba8-5018c85e81ab"
      },
      {
        name: "Connecticut",
        id: "c19fac33-7b06-4755-b738-dfe816b29ca7"
      }
    ];
    return data;
  }.property()
});
