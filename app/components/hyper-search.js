import Ember from 'ember';
import HyperSearch from 'ember-hypersearch';
const {
  RSVP: { Promise },
  $: { ajax },
  get
} = Ember;
export default HyperSearch.reopen({
  request: function(query) {
    return new Promise((resolve, reject) => {
        ajax({
          dataType: 'json',
          method: 'GET',
          url: get(this, 'endpoint'),
          data: { q: query }
        })
        .then(function(result) {
          resolve(result.data);
        }, reject);
      });
  }
});