import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('explore-benefits', 'Integration | Component | explore benefits', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{explore-benefits}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#explore-benefits}}
      template block text
    {{/explore-benefits}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
