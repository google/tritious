import Ember from 'ember';

export default Ember.ObjectController.extend({
  tileHeight: 64,
  tileWidth:  64,

  stuffToRender: function() {
    var img = this.get('img');
    var position = this.get('position');

    var stuff = [];
    stuff.push({
      'class': 'tile',
      'style': "left:   " + (position['x'] * this.get('tileWidth'))  + "px; " +
               "top:    " + (position['y'] * this.get('tileHeight')) + "px; " +
               "background-image: url('" + img + "'); " +
               ""
    });

    return stuff;
  }.property('position.x', 'position.y', 'img'),
});
