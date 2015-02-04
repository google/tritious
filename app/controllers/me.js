import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var img = this.get('img');
    var position = this.get('position');

    var stuff = [];
    stuff.push({
      'class': 'tile',
      'style': "left:   " + (position['x'] * 64) + "px; " +
               "top:    " + (position['y'] * 64) + "px; " +
               "background-image: url('" + img + "'); " +
               ""
    });

    return stuff;
  }.property('position.x', 'position.y', 'img'),
});
