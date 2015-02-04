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
            'class': map[i][j],
            'style': "left:   " + (j * 64) + "px; " +
                     "top:    " + (i * 64) + "px; " +
                     "width:  64px; " +
                     "height: 64px; " +
                     "background-image: url('" + tile['img'] + "'); " +
                     "background-size: 64px 64px; " +
                     "position: absolute; " +
                     "cursor: " + (tile['passable'] ? 'pointer' : 'auto') + "; " +
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
