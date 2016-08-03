import Ember from 'ember';

export default Ember.Mixin.create({
  init(){
    this._super(...arguments);
    this.set('routes', Ember.A());
  },
  applicationInstance: "",
  initialize(applicationInstance) {
    this.set('applicationInstance', applicationInstance);
  },
  registerRoute(route) {
    this.get('routes').pushObject(route);
  },
  reloadRoute() {
    let routes = this.get('routes');
    if(this.get('applicationInstance') !== "") {
      let applicationController = this.get('applicationInstance').lookup('controller:application');
      let currentRoute = applicationController.get('currentRouteName');
      routes.forEach(route => {
        let routeName = route.get('routeName');
        if (routeName !== currentRoute) { return; }

        if (routeName.indexOf('_error') > -1) {
          routeName = routeName.replace(/_error/, '');
          route.transitionTo(routeName);
        } else if (routeName.indexOf('.index') > -1) {
          routeName = routeName.replace(/\.index/, '');
          let parentRoute = this.get('applicationInstance').lookup('route:' + routeName);
          parentRoute.refresh();
        } else {
          route.refresh();
        }
      });
    }
  }
});
