import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.$.ajax("http://localhost:8080/api/me").then(function(me) {
      var result = {};
      result['me'] = me;

      return Ember.$.ajax("http://localhost:8080/api/map/" + me['position']['map']).then(function(map) {
        result['map'] = map;
        result['npcs'] = map['npcs'];

        return result;
      });
    });
  },

});
