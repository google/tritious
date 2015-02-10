import Ember from 'ember';

export default Ember.ObjectController.extend({
  tileHeight: 64,
  tileWidth:  64,

  height: 10,
  width: 10,
  tiles: [],
  tilesObject: {},
  activeTile: {'img': 'img/grass.png'},
  map: [],

  init: function() {
    var self = this;

    Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/tiles").then(function(result) {
      var out = [];

      /* Set the easy one. */
      self.set('tilesObject', result);

      /* Convert it to an array to make it easier to use in the template */
      for(var k in result) {
        var v = result[k];
        v['name'] = k;

        out.push(v);
      }
      self.set('tiles', out);
    }, function() {
      alert("Error loading tiles!");
    });
  },

  stuffToRender: function() {
    var stuff = [];
    var map = this.get('map');

    console.log("Render?");

    if(map) {
      for(var i = 0; i < this.get('height'); i++) {
        for(var j = 0; j < this.get('width'); j++) {
          if(map[i] && map[i][j]) {
            var image = "img/" + map[i][j] + ".png";
            var tile = this.get('tiles')[map[i][j]];
            console.log(tile);

            stuff.push({
              'class': 'tile',
              'style': "left:   " + (j * this.get('tileWidth'))  + "px; " +
                       "top:    " + (i * this.get('tileHeight')) + "px; " +
                       "background-image: url('" + image + "'); " +
                       "border: 1px solid black; " +
                       "",
              'x': j,
              'y': i,
            });
          } else {
            stuff.push({
              'class': 'tile',
              'style': "left:   " + (j * this.get('tileWidth'))  + "px; " +
                       "top:    " + (i * this.get('tileHeight')) + "px; " +
                       "border: 1px solid black; " +
                       "",
              'x': j,
              'y': i,
            });
          }
        }
      }
    }

    return stuff;
  }.property('map', 'height', 'width'),

  resizer: function() {
  }.observes('height', 'width'),

  images: function() {

  }.property('tiles'),

  actions: {
    selectTile: function(tile) {
      this.set("activeTile", tile);
    },

    putTileHere: function(x, y) {
      var map = this.get("map");
      if(!map[y]) {
        map[y] = [];
      }
      map[y][x] = this.get("activeTile");
      this.set("map", map);

      console.log(map);

      this.notifyPropertyChange('map');
    },
  },
});
