/*jshint node:true*/
var fs = require('fs');
var path = require('path');

module.exports = {
  name: 'janrain',

  isDevelopingAddon: function() {
    return true;
  },

  included: function included(app) {
    
    this.isEnabled = true;
    app.import('vendor/janrain/janrain-utils.js');
    app.import('vendor/janrain/janrain-init.js');
    app.import('vendor/janrain/janrain.css');
  },

  treeForVendor: function() {
    if (this.isEnabled) {
      return path.join(__dirname, 'vendor');
    }
  },

  treeForPublic: function() {
    if (this.isEnabled) {
      return path.join(__dirname, 'public');
    }
  },

  contentFor: function(which) {
    if (this.isEnabled) {
      if (which === 'body-footer') {
        return fs.readFileSync(path.join(__dirname, 'screens.html'), 'utf8');
      }
    }
  }
};
