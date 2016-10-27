import UserIdleService from 'ember-user-activity/services/user-idle';
import ENV from '../config/environment';

export default UserIdleService.extend({
  IDLE_TIMEOUT: (ENV.sessionTimeout) ? 1000*60*parseFloat(ENV.sessionTimeout) : 1200000,
  activeEvents: ['keypress', 'scroll', 'mousemove', 'touchstart']
});