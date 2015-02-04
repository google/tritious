import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var stuff = [];

    var img = this.get('img');
    var x   = this.get('x');
    var y   = this.get('y');

    console.log(this);

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
