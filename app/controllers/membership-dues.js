import DS from 'ember-data';

export default Ember.Controller.extend({
  actions: {
    questionnaireMembershipduesNext: function() {
      $(".renew-questionnaire").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
		$(".questionnare-btn-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
		if($(this).closest(".membership-button-container").hasClass("footer-btn-container")) {
		  $('html, body').animate({'scrollTop': $("#main-content").position().top}, 1000);
		}
    },
	membershipduesNext: function() {
    if(!$(".renew-questionnaire").hasClass("hidden")) {
      var questionnaire = $('input[name="questionnaire"]:checked').val();
      questionnaire = parseInt(questionnaire);
      if(questionnaire == 1 || questionnaire == 2) {
        $(".total-no-renew-suppdue").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
        $(".pay-now-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
        //$(".pay-now-container").addClass("hidden").siblings(".r-btn-container").addClass("hidden");
      } else {
        $(".renew-calculator").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
        $(".questionnare-btn-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
      }
    } else if(!$(".renew-calculator").hasClass("hidden")) {
      $(".total-no-renew-suppdue").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
      $(".pay-now-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
    }
    if($(this).closest(".membership-button-container").hasClass("footer-btn-container")) {
      $('html, body').animate({'scrollTop': $("#main-content").position().top}, 1000);
    }
  },
  membershipduesPrev: function() {
    var self = $(this);
    if(!$(".renew-questionnaire").hasClass("hidden")) {
      $("#profile2-edit-personal-contact-info-form").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
      $(".renew-btn-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
    } else if(!$(".total-no-renew-suppdue").hasClass("hidden") || !$(".renew-calculator").hasClass("hidden")) {
      $(".renew-questionnaire").removeClass("hidden").siblings(".membership-dues-pages").addClass("hidden");
      $(".questionnare-btn-container").removeClass("hidden").siblings(".r-btn-container").addClass("hidden");
    }
    if($(this).closest(".membership-button-container").hasClass("footer-btn-container")) {
      $('html, body').animate({'scrollTop': $("#main-content").position().top}, 1000);
    }
  },
  calculateSum: function(e){
	var self, value, amount, total, suppduesTotal;
	self = $(e.currentTarget);
	suppduesTotal = 0;
	value = ( self.val()!='' ) ? parseInt(self.val()) : 0;
	amount = parseInt(self.data("localAmount"));
	total = parseFloat(value*amount).toFixed(2);
	self.closest("h3").find(".totals").find(".totalnum").html("$ "+ total);
	self.closest("h3").find(".totals").find(".totalnum").data("total", total);
	self.closest("h3").next("div").find(".totalnum").html("$ "+ total);
	$("#accordion").find("h3 .totalnum").each(function(){
		suppduesTotal = parseInt(suppduesTotal) + parseInt($(this).data('total'));
	});
	$("#suppdues_totalamount").html("$ "+ parseFloat(suppduesTotal).toFixed(2));	
  }
  }
});

$(document).on("change", 'input[name="questionnaire"]', function(){
	if($(this).val() == 2) {
      $(".questionnaire-userform").removeClass("hidden");
    }else {
      $(".questionnaire-userform").addClass("hidden");
    }
});