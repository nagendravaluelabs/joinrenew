import ApplicationAdapter from './application';
import ENV from '../config/environment';
export default ApplicationAdapter.extend({
  buildURL() {
    return `${ENV.AIA_DRUPAL_URL}?datatype=prefix`;
  }
});