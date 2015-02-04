import Ember from 'ember';

export default Ember.ArrayController.extend({
  itemController: 'npc',

  stuffToRender: function() {
    var stuff = [];

    var img = npc.get('img');
    var x   = npc.get('x');
    var y   = npc.get('y');

    stuff.push({
      'class': 'npc',
      'style': "left:   " + (x * 64) + "px; " +
              "top:    " + (y * 64) + "px; " +
              "width:  64px; " +
              "height: 64px; " +
              "background-image: url('" + img + "'); " +
              "background-size: 64px 64px; " +
              "position: absolute; " +
              ""
    });

    return stuff;
  }.property('x', 'y', 'img'),
});
