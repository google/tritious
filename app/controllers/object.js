import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var stuff = [];

    var img = this.get('img');
    var x   = this.get('x');
    var y   = this.get('y');

    stuff.push({
      'class': 'tile clickable',
      'style': "left:   " + (x * 64) + "px; " +
               "top:    " + (y * 64) + "px; " +
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
