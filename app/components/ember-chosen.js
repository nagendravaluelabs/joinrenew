/*jslint white:true, devel:true, es6:true, this:true, browser:true*/
/*global $*/
import Ember from 'ember';
import EmberChosenCli from 'ember-cli-chosen/components/ember-chosen';
export default EmberChosenCli.extend({
    attributeBindings: ['name'],
    _setupChosen: function () {
        "use strict";
        var _this = this,
            options = _this.get('_options'),
            isMultiple = _this.get('multiple'),
            currentValue = _this.get('value'),
            selectedValue;

        if (isMultiple) {
            currentValue = Ember.makeArray(currentValue);
            _this.set('value', currentValue);
        } else {
          // If we're going from multiple -> single select, make the selected
          // value the first item in the selected value array, if an item exists
            if (Ember.isArray(currentValue) && currentValue.length > 0) {
                currentValue = currentValue[0];
                _this.set('value', currentValue);
            }
        }

        _this.$().chosen(options)
            .on('change', function (e, params) {
                var index;
                $(this).trigger("blur");
                if (isMultiple) {
                    currentValue = _this.get('value');
                    if (params.selected) {
                        currentValue.pushObject(params.selected);
                    } else {
                        index = currentValue.indexOf(params.deselected);
                        if (index !== -1) {
                            currentValue.removeAt(index);
                        }
                    }
                    selectedValue = currentValue;
                } else {
                    selectedValue = Ember.$(this).val();
                }
                _this.set('value', selectedValue);
                _this.sendAction('selectionDidChange', selectedValue);
                _this.sendAction('chosenValueChanged', selectedValue, _this);
            }).on('chosen:maxselected', function (e, chosen) {
                _this.sendAction('chosenMaxSelected', e, chosen);
            });
    }.observes('_options')
});