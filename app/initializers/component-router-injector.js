/*jslint white:true, devel:true, es6:true, this:true, browser:true */
export function initialize(application) {
  application.inject('component', 'router', 'router:main');
}

export default {
  name: 'component-router-injector',
  initialize: initialize
};