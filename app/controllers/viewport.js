import Ember from 'ember';

export default Ember.ObjectController.extend({
  conversation: null,
  conversationText: null,
  warningShowed: false,

  showWarning: function() {
    if(!this.get('warningShowed')) {
      alert("Hey, did you know that you can click on the map to move!?\n\nI left these buttons for now cuz they're fun. :)\n\nI won't bug you again!");
      this.set('warningShowed', true);
    }
  },

  actions: {
    moveHere: function(x, y) {
      this.set('me.position.x', x);
      this.set('me.position.y', y);

      // TODO: Use a real token here
      Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/move?" +
          "x=" + x + "&" +
          "y=" + y + "&" +
          "map=" + this.get('me.position.map') + "&" +
          "token=mytoken1337");
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
          var self = this;
          Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/move?" +
              "x=" + object['details']['newx'] + "&" +
              "y=" + object['details']['newy'] + "&" +
              "map=" + object['details']['newmap'] + "&" +
              "token=mytoken1337").then(function() {

            // TODO: When the map is changed, it'd be handy to automatically do
            // all this stuff
            Ember.$.ajax(window.MorphityENV.APP.APP_BASE + "/api/map/" + object['details']['newmap']).then(function(map) {
              self.set('map', map);
              self.set('npcs', map['npcs']);
              self.set('objects', map['objects']);

              self.set('me.position.x',   object['details']['newx']);
              self.set('me.position.y',   object['details']['newy']);
              self.set('me.position.map', object['details']['newmap']);
            });
          });

          //this.transitionToRoute('viewport', object['details']['newmap']);
          break;

        default:
          alert("Unknown action: " + object['type']);
      }
    },
  },
});
