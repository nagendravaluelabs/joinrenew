import ApplicationAdapter from './application';
import ENV from '../config/environment';
export default ApplicationAdapter.extend({
    buildURL() {
        "use strict";
        return `${ENV.AIA_DRUPAL_URL}?datatype=user&key=1234`;
    }
});