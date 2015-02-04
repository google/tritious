import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var img = this.get('img');
    var position = this.get('position');

    var stuff = [];
    stuff.push({
      'class': 'me',
      'style': "left:   " + (position['x'] * 64) + "px; " +
               "top:    " + (position['y'] * 64) + "px; " +
               "width:  64px; " +
               "height: 64px; " +
               "background-image: url('" + img + "'); " +
               "background-size: 64px 64px; " +
               "position: absolute; " +
               ""
    });

    return stuff;
  }.property('position.x', 'position.y', 'img'),
});
