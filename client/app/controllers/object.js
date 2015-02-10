import Ember from 'ember';

export default Ember.ObjectController.extend({
  tileHeight: 64,
  tileWidth:  64,

  stuffToRender: function() {
    var stuff = [];

    var img = this.get('img');
    var x   = this.get('x');
    var y   = this.get('y');

    stuff.push({
      'class': 'tile clickable',
      'style': "left:   " + (x * this.get('tileWidth'))  + "px; " +
               "top:    " + (y * this.get('tileHeight')) + "px; " +
               "background-image: url('" + img + "'); " +
               "",

      'details': {
        'type':    this.get('type'),
        'img':     this.get('img'),
        'details': this.get('details'),
        'x':       this.get('x'),
        'y':       this.get('y'),
      }
    });

    return stuff;
  }.property('x', 'y', 'img'),
});
