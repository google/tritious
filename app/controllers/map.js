import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var stuff = [];
    var map = this.get('map');
    var tiles = this.get('tiles');

    if(map) {
      for(var i = 0; i < map.length; i++) {
        for(var j = 0; j < map[i].length; j++) {
          var tile = tiles[map[i][j]];

          if(!tile) {
            tile = tiles['404'];
          }

          stuff.push({
            'class': 'tile ' + (tile['passable'] ? 'clickable' : ''),
            'style': "left:   " + (j * 64) + "px; " +
                     "top:    " + (i * 64) + "px; " +
                     "background-image: url('" + tile['img'] + "'); " +
                     "",
            'passable': tile['passable'],
            'x': j,
            'y': i,
          });
        }
      }
    }

    return stuff;
  }.property('map', 'tiles'),
});
