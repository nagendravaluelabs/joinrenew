import Ember from 'ember';
const { $ } = Ember;

export default Ember.Component.extend({
  didInsertElement: function() {
    this.chapterSelection.call(this, $('input[name="choose_chapter"]:checked'), true);
  },
  prefixes: function() {
    var data = ["Dr.", "Hon.", "Miss", "Mr.", "Mrs.", "Ms.", "Rev."];
    return data;
  }.property(),
  suffixes: function(){
    var data = ["Esq.", "II", "III", "IV", "Jr.", "Sr.", "V"];
    return data;
  }.property(),
  addressType: function() {
    var data = ["home", "mobile", "work"];
    return data;
  }.property(),
  chaptersType: function() {
    var data = ["home", "work"];
    return data;
  }.property(),
  companyType: function() {
    var data = ["Advertising", "Architecture Firm", "Building Product Manufacturer", "Construction Firm", "Consulting Firm", "Contractor", "Design &amp; Construction Services", "Design-Build"];
    return data;
  }.property(),
  chapterSelection: function(obj, isInit) {
    //isInit = (typeof isInit === "object") ? isInit.data.isInit : isInit;
    isInit = (typeof isInit === "undefined") ? false : isInit;
    var self = $(obj);
    var thisValue = self.val();
    $('.'+thisValue+'Address-container').removeClass("hidden").siblings('.address-container').addClass("hidden");
    $(".address-block-container").removeClass('mode-homeAddress mode-workAddress mode-add-company');
    $('#company-organization').addClass("hidden");
    $(".personalinfo_third_party, .actions-btn").removeClass("hidden");
    if(isInit) {
      if($('input[name="add_my_work_address"]').is(":checked")) {
        this.moreAddressLocation.call($('input[name="add_my_work_address"]'));
      }
      if($('input[name="add_my_home_address"]').is(":checked")) {
        this.moreAddressLocation.call($('input[name="add_my_home_address"]'));
      }
    } else {
      $('input[name="add_my_work_address"], input[name="add_my_home_address"]').prop("checked", false);
    }
  },
  moreAddressLocation: function() {
    var self = $(this);
    var thisValue = self.data("value");
    var displayedAddress = (thisValue === 'home') ? 'work' : 'home';
    if(self.is(':checked')) {
      var addressElement = $("."+thisValue+"Address-container").detach();
      addressElement.insertAfter("."+displayedAddress+"Address-container");
      $("."+thisValue+"Address-container").removeClass("hidden");
      $(".address-block-container").addClass('mode-'+thisValue+'Address');
    } else {
      $("."+thisValue+"Address-container").addClass("hidden");
      $(".address-block-container").removeClass('mode-'+thisValue+'Address');
      $('#company-organization').addClass("hidden");
      $(".address-block-container").removeClass('mode-add-company');
      $(".personalinfo_third_party, .actions-btn").removeClass("hidden");
    }
  },
  actions: {
    chapterSelection: function() {
      this.chapterSelection.call(this, $('input[name="choose_chapter"]:checked'), false);
    },
    createNewOrganization: function() {
      if($('#company-organization').hasClass("hidden")) {
        $('#company-organization').removeClass("hidden");
        $(".address-block-container").addClass('mode-add-company');
        $(".personalinfo_third_party, .actions-btn").addClass("hidden");
      } else {
        $('#company-organization').addClass("hidden");
        $(".address-block-container").removeClass('mode-add-company');
        $(".personalinfo_third_party, .actions-btn").removeClass("hidden");
      }
      $('#company-organization').find(".select-chosen").chosen("destroy");
      $('#company-organization').find(".select-chosen").chosen();
    }
  }
});
