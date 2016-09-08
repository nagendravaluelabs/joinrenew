import Ember from 'ember';
import HyperSearch from 'ember-hypersearch';
const {
  A: emberArray,
  RSVP: { Promise, resolve, reject },
  $: { ajax },
  isBlank,
  isPresent,
  get
} = Ember;
function keyForQuery(query) {
  return `_cache.${query}`;
}
export default HyperSearch.reopen({
  init: function () {
    this._super(...arguments);
    this._cache = {};
    this.results = emberArray();
    var self = this;
    Ember.$(document).on("click", "body", function(e){
      if(!Ember.$(e.target).hasClass("hypersearch-input")) {
        get(self, 'results').clear();
      }
    });
  },
  request: function(query) {
    return new Promise((resolve, reject) => {
        ajax({
          dataType: 'json',
          method: 'GET',
          url: get(this, 'endpoint'),
          data: { q: query },
          beforeSend: function() {
            Ember.$('.ajax-spinner').hide();
            Ember.$(".hypersearch-input").addClass("hypersearch-loading");
          },
          complete: function() {
            Ember.$(".hypersearch-input").removeClass("hypersearch-loading");
          }
        })
        .then(function(result) {
          resolve(result.data);
        }, reject);
      });
  },
  fetch: function(query) {
    if (isBlank(query) || (query.length < get(this, 'minQueryLength'))) {
      get(this, 'results').clear();
      return reject();
    }

    let cachedValue = get(this, keyForQuery(query));

    return isPresent(cachedValue) ? resolve(cachedValue) : this.requestAndCache(...arguments);
  },
  requestAndCache: function(query) {
    return this.request(query)
      .then((results) => this.cache(query, results))
      .catch((error) => reject(error));
  },
  clearResults() {
    get(this, 'results').clear();
    this.notifyPropertyChange('results');
  },
  actions: {
    selectResult(result) {
      this._handleAction('selectResult', result);
      this.clearResults();
    }
  }
});