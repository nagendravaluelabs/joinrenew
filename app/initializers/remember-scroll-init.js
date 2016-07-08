import Ember from "ember";
import rememberScrollMixin from "../mixins/remember-scroll";
var rememberScroll = Ember.Mixin.create(rememberScrollMixin, {
  render: function(controller, model) {
    this._super();
    this.scrollToTop();
  },
  activate: function() {
    this._super.apply(this, arguments);
    Ember.run.schedule("afterRender", this, function () {
      this.scrollToTop();
    });
  }
});

export function initialize() {
  Ember.Route.reopen(rememberScroll);
}

export default {
  name: 'remember-scroll-init',
  initialize: initialize
};