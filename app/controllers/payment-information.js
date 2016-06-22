import DS from 'ember-data';

export default Ember.Controller.extend({
	init: function () {
		
	  }
}); 
  $(document).on("change", 'input[name="payment_method"]',function(){ 
			var self = $(this);
			var thisID = self.data("id");
			$(thisID).removeClass("hidden");
			$('.payment_method_container:not('+thisID+')').addClass("hidden");
			$(".extrainfo_icon").on("click", function(){
			$(".payment-plan").css("display", "block")
      
    })
	});