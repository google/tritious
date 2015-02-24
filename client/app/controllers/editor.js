// Copyright 2015 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

import Ember from 'ember';

export default Ember.ObjectController.extend({
  tileHeight: 64,
  tileWidth:  64,

  height: 10,
  width: 10,
  name: "nameme!",
  tiles: [],
  tilesObject: {},
  activeTile: "clear",
  map: [],

  test: 0,

  init: function() {
    var self = this;

    Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/tiles").then(function(result) {
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

    for(var i = 0; i < this.get('height'); i++) {
      for(var j = 0; j < this.get('width'); j++) {
        if(map[i] && map[i][j]) {
          for(var k = 0; k < map[i][j].length; k++) {
            var image = "img/" + map[i][j][k] + ".png";

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
          }
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

      var called = this.get("test");
      called++;
      console.log("Called " + called + " times!");
      this.set("test", called);

      if(!map[y]) {
        map[y] = [];
      }

      if(this.get("activeTile") === "clear") {
        map[y][x] = [];
      } else {
        if(!map[y][x]) {
          map[y][x] = [];
        }

        map[y][x].push(this.get("activeTile"));
      }

      this.notifyPropertyChange('map');
    },
  },
});
