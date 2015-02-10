import Ember from 'ember';

export default Ember.ObjectController.extend({
  tileHeight: 64,
  tileWidth:  64,

  stuffToRender: function() {
    var stuff = [];
    var map = this.get('map');
    var tiles = this.get('tiles');

    if(map) {
      for(var i = 0; i < map.length; i++) {
        for(var j = 0; j < map[i].length; j++) {
          if(!(map[i][j] instanceof Array)) {
            map[i][j] = [map[i][j]];
          }

          map[i][j] = map[i][j].reverse();

          for(var k = 0; k < map[i][j].length; k++) {
            var tile = tiles[map[i][j][k]];

            if(!tile) {
              tile = tiles['404'];
            }

            stuff.push({
              'class': 'tile ' + (tile['passable'] ? 'clickable' : ''),
              'style': "left:   " + (j * this.get('tileWidth'))  + "px; " +
                       "top:    " + (i * this.get('tileHeight')) + "px; " +
                       "background-image: url('" + tile['img'] + "'); " +
                       "",
              'passable': tile['passable'],
              'x': j,
              'y': i,
            });
          }
        }
      }
    }

    return stuff;
  }.property('map', 'tiles'),
});
