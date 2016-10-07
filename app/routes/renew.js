/*jslint white:true, devel:true, es6:true, this:true, browser:true */
import Ember from 'ember';

export default Ember.Route.extend({
  activate() {
    "use strict";
    this.controllerFor("application").set("model.class","no-sidebars page-renew");
  },
  model(){
    "use strict";
    return Ember.RSVP.hash({
      page: {
        "body": "<h2>88,000 members, <br> 260 chapters, <br> 1 you.</h2><p>Your vision is unique.  Your work is distinctive. Your career path is your own. We're excited to see where you're going &#8212; and we can help you get there.</p>",
        "field_aia_image": "images/haley-gipe2_0.jpg",
        "title": "Renew"
      },
      benefits: {}
    });
  }
});