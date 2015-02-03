import Ember from 'ember';

export default Ember.ObjectController.extend({
  stuffToRender: function() {
    var stuff = [];
    var map = this.get('map');
    var tiles = this.get('tiles');

    console.log("Another test:");
    console.log(map);
    console.log(tiles);
    if(map) {
      for(var i = 0; i < map.length; i++) {
        for(var j = 0; j < map[i].length; j++) {
          var tile = tiles[map[i][j]];

          if(!tile) {
            tile = tiles['404'];
          }

          stuff.push({
            'class': map[i][j],
            'style': "left: " + (j * 64) + "px; " +
                     "top:  " + (i * 64) + "px; " +
                     "background-image: url('" + tile['img'] + "'); " +
                     "",
            'passable': tile['passable'],
          });
        }
      }
    }

    return stuff;
  }.property('map', 'tiles'),
});
