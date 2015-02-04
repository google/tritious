import Ember from 'ember';

export default Ember.ObjectController.extend({
  actions: {
    up: function() {
      this.set('me.position.y', this.get('me.position.y') - 1);
    },
    down: function() {
      this.set('me.position.y', this.get('me.position.y') + 1);
    },
    left: function() {
      this.set('me.position.x', this.get('me.position.x') - 1);
    },
    right: function() {
      this.set('me.position.x', this.get('me.position.x') + 1);
    },
  },
});
