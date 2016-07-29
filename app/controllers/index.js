import Ember from 'ember';
const {$} = Ember;

export default Ember.Controller.extend({
    actions: {
        changeExploreBenefits: function () {
            "use strict";
            var presentList = $('#select-explore-benefits option:selected').index();
            $('#benefits-wrapper .slick-slider').slick('slickGoTo', presentList);
        }
    }
});
