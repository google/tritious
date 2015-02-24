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

  stuffToRender: function() {
    var img = this.get('img');
    var position = this.get('position');

    var stuff = [];
    stuff.push({
      'class': 'tile',
      'style': "left:   " + (position['x'] * this.get('tileWidth'))  + "px; " +
               "top:    " + (position['y'] * this.get('tileHeight')) + "px; " +
               "background-image: url('" + img + "'); " +
               ""
    });

    return stuff;
  }.property('position.x', 'position.y', 'img'),
});
