/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
import Ember from 'ember';
const {$} = Ember;

export default Ember.Component.extend({
    didInsertElement: function () {
        "use strict";
        this.initExploreBenefits();
    },
    initExploreBenefits: function () {
        "use strict";
        var selected, key, title, viewport;
        selected = $('#benefits-wrapper').find('.benefits-body.slick-active');
        key = selected.data('nid');
        title = selected.data('title');
        viewport = $('.renew-page-benefits .viewport');
        $("#select-explore-benefits").val(key);
        viewport.text(title);
        if (title === "Select your status") {
            viewport.css('color', '#C2C4C5');
        } else {
            viewport.css('color', '#EE3D32');
        }
    },
    actions: {
        exploreBenefits: function () {
            "use strict";
            var selected, key, title, viewport;
            selected = $('#benefits-wrapper').find('.benefits-body.slick-active');
            key = selected.data('nid');
            title = selected.data('title');
            viewport = $('.renew-page-benefits .viewport');
            $("#select-explore-benefits").val(key);
            viewport.text(title);
            if (title === "Select your status") {
                viewport.css('color', '#C2C4C5');
            } else {
                viewport.css('color', '#EE3D32');
            }
        }
    }
});
