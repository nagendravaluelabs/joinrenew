import Ember from 'ember';
import RouteRefresherMixin from '../mixins/route-refresher';
export default Ember.Route.extend(RouteRefresherMixin, {
  activate() {
    this.controllerFor("application").set("model.class","");
  }
});
