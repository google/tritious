import Ember from 'ember';

export default Ember.ObjectController.extend({
  conversation: null,
  conversationText: null,

  actions: {
    up: function() {
      this.set('me.position.y', this.get('me.position.y') - 1);
    },
    down: function() {
      this.set('me.position.y', this.get('me.position.y') + 1);
    },
    left: function() {
      this.set('me.position.x', this.get('me.position.x') - 1);
    },
    right: function() {
      this.set('me.position.x', this.get('me.position.x') + 1);
    },

    moveHere: function(x, y) {
      this.set('me.position.x', x);
      this.set('me.position.y', y);
    },

    talk: function(npc) {
      var self = this;

      Ember.$.ajax("http://localhost:8080/api/npc/" + npc).then(function(result) {
        self.set('conversation', result);
        self.send('nextConversation');
      });
    },

    nextConversation: function() {
      var conversation = this.get('conversation');

      if(!conversation) {
        return null;
      }

      console.log(conversation);
      if(conversation['text'].length === 0) {
        this.set('conversation', null);
        return null;
      }

      this.set('conversationText', conversation['text'].shift());
    },
  },
});
