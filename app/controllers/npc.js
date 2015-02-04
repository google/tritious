import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: "npcs",
  npcs: Ember.computed.alias("controllers.post"),

  stuffToRender: function() {
    var stuff = [];

    var img = this.get('img');
    var x   = this.get('x');
    var y   = this.get('y');

    console.log(this);

    stuff.push({
      'class': 'tile clickable',
      'style': "left:   " + (x * 64) + "px; " +
              "top:    " + (y * 64) + "px; " +
              "background-image: url('" + img + "'); " +
              "",
      'id': this.get('id'),
    });

    return stuff;
  }.property('x', 'y', 'img'),

});
