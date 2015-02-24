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
  conversation: null,
  conversationText: null,
  warning: null,

  /* Automatically load the map whenever me.position.newmap is set */
  updateMap: function() {
    var self = this;

    if(this.get('newmap')) {
      Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/map/" + this.get('newmap')).then(
        function(map) {
          self.set('map', map);

          self.set('me.position.x',   self.get('newx'));
          self.set('me.position.y',   self.get('newy'));
          self.set('me.position.map', self.get('newmap'));
        },
        function() {
          self.set('warning', "An error occured while trying to change maps, refreshing might help!");
        }
      );
    }
  }.observes('newmap'),

  /* This basically just sets up some variables in such a way that updateMap()
   * will take over. */
  changeMap: function(newmap, x, y) {
    var self = this;

    // TODO: Use a real token here
    Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/move?" + "x=" + x + "&" + "y=" + y + "&" + "map=" + newmap + "&" + "token=mytoken1337").then(
      function() {
        self.set('newx',   x);
        self.set('newy',   y);
        self.set('newmap', newmap);
      },
      function() {
        self.set('warning', "An error occured while trying to change maps, refreshing might help!");
      }
    );
  },

  move: function(x, y) {
    var self = this;

    var oldx   = this.get('me.position.x');
    var oldy   = this.get('me.position.y');

    this.set('me.position.x', x);
    this.set('me.position.y', y);

    // TODO: Use a real token here
    Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/move?" + "x=" + x + "&" + "y=" + y + "&" + "map=" + this.get('me.position.map') + "&" + "token=mytoken1337").then(
      // Success
      function() {
      },
      function() {
        self.set("warning", "Couldn't save new position!");

        this.set('me.position.x', oldx);
        this.set('me.position.y', oldy);
      }
    );
  },

  actions: {
    moveHere: function(x, y) {
      this.move(x, y);
    },

    talk: function(npc) {
      var self = this;

      Ember.$.ajax(window.TritiousENV.APP.APP_BASE + "/api/npc/" + npc['id']).then(function(result) {
        self.set('conversation', result);
        self.set('conversationImage', npc['img']);
        self.send('nextConversation');
      });
    },

    nextConversation: function() {
      var conversation = this.get('conversation');

      if(!conversation) {
        return null;
      }

      if(conversation['text'].length === 0) {
        this.set('conversation', null);
        return null;
      }

      this.set('conversationText', conversation['text'].shift());
    },

    interact: function(object) {
      console.log(object);
      switch(object['type']) {
        case 'exit':
          this.changeMap(object['details']['newmap'], object['details']['newx'], object['details']['newy']);

          break;

        default:
          alert("Unknown action: " + object['type']);
      }
    },

    reset: function() {
      this.changeMap("main", 4, 4);
    }
  },
});
