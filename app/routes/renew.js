import Ember from 'ember';

export default Ember.Route.extend({
activate() {
  this.controllerFor("application").set("model.class","no-sidebars page-renew");
},
model(){
  return Ember.RSVP.hash({
    page: {
        "body": "<h2>85,000 members, <br> 260 chapters, <br> 1 you.</h2><p>Your vision is unique.  Your work is distinctive. Your career path is your own. We're excited to see where you're going — and we can help you get there.</p>",
        "field_aia_image": "http://aiadev2.prod.acquia-sites.com/sites/dev/files/styles/aia_renew_landing/public/haley-gipe2_0.jpg",
        "title": "Renew"
      },
    benefits: {}
  });
}

});