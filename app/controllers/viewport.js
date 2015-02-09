import Ember from 'ember';

export default Ember.ObjectController.extend({
  conversation: null,
  conversationText: null,
  warning: null,

  changeMap: function(newmap, x, y) {
    var self = this;

    // TODO: Use a real token here
    Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/move?" + "x=" + x + "&" + "y=" + y + "&" + "map=" + newmap + "&" + "token=mytoken1337").then(
      function() {
        Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/map/" + newmap).then(
          function(map) {
            self.set('map', map);
            self.set('npcs', map['npcs']);
            self.set('objects', map['objects']);

            self.set('me.position.x',   x);
            self.set('me.position.y',   y);
            self.set('me.position.map', newmap);
          },
          function() {
            self.set('warning', "An error occured while trying to change maps, refreshing might help!");
          }
        );
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
    Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/move?" + "x=" + x + "&" + "y=" + y + "&" + "map=" + this.get('me.position.map') + "&" + "token=mytoken1337").then(
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

      Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/npc/" + npc['id']).then(function(result) {
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
  },
});
