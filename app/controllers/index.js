import DS from 'ember-data';

export default Ember.Controller.extend({
  someName: function () {
      alert($('#benefits-wrapper').length)
      $('#benefits-wrapper .slick-slider').on('init', function(event, slick) {
        alert()
      });

  }.on('didInsertElement'),
  actions: {
    changeExploreBenefits: function(param) {
      var presentList = $('#select-explore-benefits option:selected').index();
      console.log(presentList)
      $('#benefits-wrapper .slick-slider').slick('slickGoTo', presentList);
    }
  }
});
