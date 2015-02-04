import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return Ember.$.ajax("http://localhost:8080/api/me").then(function(me) {
      var result = {};
      result['me'] = me;

      var map_id = me['position']['map'];

      if(params.map_id && params.map_id !== '') {
        map_id = params.map_id;
      }

      return Ember.$.ajax("http://localhost:8080/api/map/" + map_id).then(function(map) {
        result['map'] = map;
        result['npcs'] = map['npcs'];
        result['objects'] = map['objects'];

        return result;
      });
    });
  },

});
